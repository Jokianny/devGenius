<?php
/**
 * ==============================================================================
 * DevGenius Academy - Automatic Web-Based Database & System Installer
 * Works on ANY Apache Shared Hosting: cPanel & DirectAdmin
 * ==============================================================================
 * This installer automatically:
 * 1. Validates server requirements (PHP 8.1+, PDO MySQL, mbstring)
 * 2. Tests database connection credentials (with localhost / 127.0.0.1 fallback)
 * 3. Finds and imports `database.sql` directly into MySQL
 * 4. Configures and writes `includes/config.php`
 * 5. Creates `installed.lock` to prevent unauthorized re-runs
 */

session_start();

$lockFile = __DIR__ . '/installed.lock';
$configFile = __DIR__ . '/includes/config.php';
$sqlFile = file_exists(__DIR__ . '/database.sql') 
    ? __DIR__ . '/database.sql' 
    : (file_exists(__DIR__ . '/../database.sql') ? __DIR__ . '/../database.sql' : null);

$isAlreadyInstalled = file_exists($lockFile);

// Protocol and Host Auto-detection
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || ($_SERVER['SERVER_PORT'] ?? 80) == 443) ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$autoAppUrl = rtrim($protocol . $host . $scriptDir, '/');

$error = '';
$success = false;
$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;

// PHP & Extension verification
$phpOk = version_compare(PHP_VERSION, '8.1.0', '>=');
$pdoOk = extension_loaded('pdo') && extension_loaded('pdo_mysql');
$mbstringOk = extension_loaded('mbstring');
$configWritable = is_writable(dirname($configFile)) || (file_exists($configFile) && is_writable($configFile));
$requirementsMet = $phpOk && $pdoOk && $mbstringOk;

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$isAlreadyInstalled) {
    $dbHost = trim($_POST['db_host'] ?? 'localhost');
    $dbPort = trim($_POST['db_port'] ?? '3306');
    $dbName = trim($_POST['db_name'] ?? '');
    $dbUser = trim($_POST['db_user'] ?? '');
    $dbPass = $_POST['db_pass'] ?? '';
    $adminEmail = trim(strtolower($_POST['admin_email'] ?? 'admin@devgenius.academy'));
    $adminPass = $_POST['admin_pass'] ?? 'Password123!';

    if (empty($dbName) || empty($dbUser)) {
        $error = 'Database Name and Database Username are required.';
    } elseif (!$sqlFile || !file_exists($sqlFile)) {
        $error = 'database.sql file was not found on the server. Please ensure database.sql is uploaded to the root directory.';
    } else {
        // Step 1: Attempt PDO connection with smart loopback fallback
        $pdo = null;
        $connectionError = '';
        $hostsToTry = [$dbHost];
        if ($dbHost === 'localhost') {
            $hostsToTry[] = '127.0.0.1'; // Fixes DirectAdmin socket mismatch
        }

        foreach ($hostsToTry as $tryHost) {
            try {
                $dsn = "mysql:host={$tryHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
                $pdo = new PDO($dsn, $dbUser, $dbPass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]);
                $dbHost = $tryHost; // Use working host
                break;
            } catch (PDOException $e) {
                $connectionError = $e->getMessage();
            }
        }

        if (!$pdo) {
            $error = "Database Connection Failed: " . htmlspecialchars($connectionError) . 
                     "<br><br><strong>Tip:</strong> In cPanel and DirectAdmin, ensure the database name and user include your hosting account prefix (e.g., <code>username_dbname</code>) and that you granted ALL PRIVILEGES.";
        } else {
            // Step 2: Auto-import database.sql
            try {
                $sqlContent = file_get_contents($sqlFile);
                if (empty($sqlContent)) {
                    throw new Exception("database.sql is empty.");
                }

                // Disable foreign key checks during import to allow tables and foreign keys to link seamlessly
                $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");

                // Step A: Strip block comments /* ... */
                $cleanSql = preg_replace('!/\*.*?\*/!s', '', $sqlContent);

                // Step B: Strip line comments (-- or #) line-by-line so CREATE TABLE statements are never skipped
                $lines = explode("\n", $cleanSql);
                $filteredLines = [];
                foreach ($lines as $line) {
                    $trimmedLine = trim($line);
                    if (str_starts_with($trimmedLine, '--') || str_starts_with($trimmedLine, '#')) {
                        continue;
                    }
                    $filteredLines[] = $line;
                }
                $cleanSql = implode("\n", $filteredLines);

                // Step C: Split statements by semicolon while respecting string literals
                $statements = [];
                $currentStmt = '';
                $inString = false;
                $stringChar = '';

                $len = strlen($cleanSql);
                for ($i = 0; $i < $len; $i++) {
                    $char = $cleanSql[$i];
                    $prevChar = $i > 0 ? $cleanSql[$i - 1] : '';

                    if (($char === "'" || $char === '"') && $prevChar !== '\\') {
                        if (!$inString) {
                            $inString = true;
                            $stringChar = $char;
                        } elseif ($stringChar === $char) {
                            $inString = false;
                        }
                    }

                    if ($char === ';' && !$inString) {
                        $stmtToRun = trim($currentStmt);
                        if (!empty($stmtToRun)) {
                            $statements[] = $stmtToRun;
                        }
                        $currentStmt = '';
                    } else {
                        $currentStmt .= $char;
                    }
                }
                if (!empty(trim($currentStmt))) {
                    $statements[] = trim($currentStmt);
                }

                // Step D: Execute all parsed statements sequentially
                foreach ($statements as $stmt) {
                    $pdo->exec($stmt);
                }

                $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

                // Step 3: Update or create initial Administrator password if customized
                if (!empty($adminPass) && $adminPass !== 'Password123!') {
                    $hashed = password_hash($adminPass, PASSWORD_BCRYPT);
                    $stmtUpdateAdmin = $pdo->prepare("UPDATE users SET password = ? WHERE role = 'admin' LIMIT 1");
                    $stmtUpdateAdmin->execute([$hashed]);
                }

                // Step 4: Automatically write includes/config.php
                if (!is_dir(dirname($configFile))) {
                    @mkdir(dirname($configFile), 0755, true);
                }
                $configContent = "<?php\n" .
                    "/**\n" .
                    " * DevGenius Academy - Core Configuration\n" .
                    " * Automatically configured by DevGenius Web Installer on " . date('Y-m-d H:i:s') . "\n" .
                    " */\n\n" .
                    "define('DB_HOST', " . var_export($dbHost, true) . ");\n" .
                    "define('DB_NAME', " . var_export($dbName, true) . ");\n" .
                    "define('DB_USER', " . var_export($dbUser, true) . ");\n" .
                    "define('DB_PASS', " . var_export($dbPass, true) . ");\n" .
                    "define('DB_PORT', " . var_export($dbPort, true) . ");\n" .
                    "define('DB_CHARSET', 'utf8mb4');\n\n" .
                    "define('APP_NAME', 'DevGenius Academy');\n\n" .
                    "\$protocol = (!empty(\$_SERVER['HTTPS']) && \$_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';\n" .
                    "\$host = \$_SERVER['HTTP_HOST'] ?? 'localhost';\n" .
                    "\$scriptDir = str_replace('\\\\', '/', dirname(\$_SERVER['SCRIPT_NAME'] ?? ''));\n" .
                    "\$baseDir = rtrim(preg_replace('/(\\/student|\\/admin|\\/includes)$/', '', \$scriptDir), '/');\n" .
                    "define('APP_URL', \$protocol . \$host . \$baseDir);\n\n" .
                    "define('UPLOAD_DIR', __DIR__ . '/../uploads/');\n" .
                    "define('MAX_UPLOAD_SIZE', 25 * 1024 * 1024);\n\n" .
                    "if (session_status() === PHP_SESSION_NONE) {\n" .
                    "    ini_set('session.cookie_httponly', '1');\n" .
                    "    ini_set('session.use_only_cookies', '1');\n" .
                    "    ini_set('session.cookie_samesite', 'Lax');\n" .
                    "    session_start();\n" .
                    "}\n";

                file_put_contents($configFile, $configContent);

                // Step 5: Create security lock file
                file_put_contents($lockFile, "Installed on " . date('c') . " from IP: " . ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'));

                $success = true;
            } catch (Exception $ex) {
                $error = "Database Installation Error: " . htmlspecialchars($ex->getMessage());
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automatic Setup & Database Installer | DevGenius Academy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4, .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-[#F2F6FF] text-slate-900 min-h-screen flex flex-col items-center justify-center p-4">

<div class="max-w-xl w-full my-8">
    <!-- Brand Logo Header -->
    <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#082592] to-[#1746C5] flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-900/20">
                DG
            </div>
            <div class="text-left">
                <div class="font-heading font-extrabold text-2xl tracking-tight text-[#061A3A] leading-tight">
                    DEVGENIUS <span class="text-xs px-2 py-0.5 rounded bg-[#F28C18]/15 text-[#F28C18] font-bold">ACADEMY</span>
                </div>
                <div class="text-xs text-slate-500 font-medium">Automatic Shared Hosting Installer</div>
            </div>
        </div>
    </div>

    <!-- Main Container Card -->
    <div class="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        
        <?php if ($isAlreadyInstalled): ?>
            <!-- Already Installed Screen -->
            <div class="p-8 text-center space-y-4">
                <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                </div>
                <h2 class="text-2xl font-heading font-extrabold text-[#061A3A]">
                    DevGenius Academy is Already Installed
                </h2>
                <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    The installation is locked for security (<code>installed.lock</code> is present). Your database and configuration are fully operational.
                </p>
                <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="index.php" class="py-3 px-6 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-md transition-all">
                        Launch Homepage
                    </a>
                    <a href="login.php" class="py-3 px-6 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-md transition-all">
                        Admin Login
                    </a>
                </div>
                <p class="text-[11px] text-slate-400 pt-3">
                    To re-run this setup, delete <code>installed.lock</code> from your server root.
                </p>
            </div>

        <?php elseif ($success): ?>
            <!-- Success Screen -->
            <div class="p-8 text-center space-y-5 animate-in fade-in">
                <div class="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto text-3xl font-extrabold shadow-lg shadow-emerald-500/20">
                    ✓
                </div>
                <div class="space-y-1">
                    <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider">Installation Complete</span>
                    <h2 class="text-2xl font-heading font-extrabold text-[#061A3A]">
                        Database & System Configured!
                    </h2>
                </div>
                <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    All 8 relational MySQL tables have been created, seed data imported, and <code>includes/config.php</code> written successfully.
                </p>

                <!-- Credentials Info Box -->
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2">
                    <div class="font-bold text-slate-800">Your Administrator Credentials:</div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                        <div>Email: <strong class="text-slate-900"><?= htmlspecialchars($_POST['admin_email'] ?? 'admin@devgenius.academy') ?></strong></div>
                        <div>Password: <strong class="text-slate-900"><?= htmlspecialchars($_POST['admin_pass'] ?? 'Password123!') ?></strong></div>
                    </div>
                </div>

                <div class="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="index.php" class="py-3 px-6 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-md transition-all">
                        Open DevGenius Homepage
                    </a>
                    <a href="login.php" class="py-3 px-6 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-md transition-all">
                        Sign In as Administrator
                    </a>
                </div>
            </div>

        <?php else: ?>
            <!-- Step-by-Step Installation Form -->
            <div class="bg-[#061A3A] text-white p-6 border-b border-white/10">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-heading font-bold text-white">Database Auto-Installer</h2>
                        <p class="text-xs text-slate-300">Enter your cPanel or DirectAdmin database credentials.</p>
                    </div>
                    <span class="text-xs font-bold px-2.5 py-1 rounded bg-[#082592] text-white border border-blue-400/30">
                        Apache Shared Hosting
                    </span>
                </div>
            </div>

            <!-- Server Requirements Verification Strip -->
            <div class="bg-slate-50 px-6 py-3 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-600">
                <span class="flex items-center gap-1.5">
                    <span class="<?= $phpOk ? 'text-emerald-600' : 'text-rose-600' ?> font-bold">●</span>
                    PHP <?= PHP_VERSION ?> (<?= $phpOk ? 'Supported' : 'Requires 8.1+' ?>)
                </span>
                <span class="flex items-center gap-1.5">
                    <span class="<?= $pdoOk ? 'text-emerald-600' : 'text-rose-600' ?> font-bold">●</span>
                    PDO MySQL
                </span>
                <span class="flex items-center gap-1.5">
                    <span class="<?= $sqlFile ? 'text-emerald-600' : 'text-rose-600' ?> font-bold">●</span>
                    database.sql Found
                </span>
            </div>

            <div class="p-6 sm:p-8 space-y-6">
                <?php if ($error): ?>
                    <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 leading-relaxed">
                        <?= $error ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="install.php" class="space-y-4 text-xs">
                    <div class="space-y-1">
                        <label class="block font-bold text-slate-800">Database Host</label>
                        <input type="text" name="db_host" required value="<?= htmlspecialchars($_POST['db_host'] ?? 'localhost') ?>"
                               placeholder="localhost or 127.0.0.1"
                               class="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
                        <p class="text-[11px] text-slate-400">Leave as <code>localhost</code> (the installer automatically tests 127.0.0.1 if socket fails).</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="block font-bold text-slate-800">Database Name</label>
                            <input type="text" name="db_name" required value="<?= htmlspecialchars($_POST['db_name'] ?? '') ?>"
                                   placeholder="e.g. cpuser_academy"
                                   class="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
                            <p class="text-[11px] text-slate-400">Created in cPanel / DirectAdmin MySQL tool.</p>
                        </div>

                        <div class="space-y-1">
                            <label class="block font-bold text-slate-800">Database Username</label>
                            <input type="text" name="db_user" required value="<?= htmlspecialchars($_POST['db_user'] ?? '') ?>"
                                   placeholder="e.g. cpuser_aca_user"
                                   class="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
                            <p class="text-[11px] text-slate-400">User attached with ALL PRIVILEGES.</p>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="block font-bold text-slate-800">Database Password</label>
                        <input type="password" name="db_pass" value="<?= htmlspecialchars($_POST['db_pass'] ?? '') ?>"
                               placeholder="Database user password"
                               class="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
                    </div>

                    <!-- Administrator Account Customization -->
                    <div class="pt-4 border-t border-slate-100 space-y-3">
                        <span class="text-[11px] font-bold text-[#082592] uppercase">Admin Portal Credentials</span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="block font-semibold text-slate-700">Admin Email</label>
                                <input type="email" name="admin_email" required value="<?= htmlspecialchars($_POST['admin_email'] ?? 'admin@devgenius.academy') ?>"
                                       class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                            </div>
                            <div class="space-y-1">
                                <label class="block font-semibold text-slate-700">Admin Password</label>
                                <input type="password" name="admin_pass" required value="<?= htmlspecialchars($_POST['admin_pass'] ?? 'Password123!') ?>"
                                       class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                            </div>
                        </div>
                    </div>

                    <div class="pt-4">
                        <button type="submit" 
                                class="w-full py-3.5 px-6 bg-[#F28C18] hover:bg-[#d9770e] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2">
                            <span>Test Connection & Auto-Install Database</span>
                            <span>→</span>
                        </button>
                    </div>
                </form>
            </div>
        <?php endif; ?>

    </div>
</div>

</body>
</html>
