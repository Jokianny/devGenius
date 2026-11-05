<?php
/**
 * DevGenius Academy - Secure PDO Database Handler
 * Compatible with cPanel (MySQL 5.7/8.0, MariaDB) & DirectAdmin (CustomBuild MySQL/MariaDB)
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;

    public static function connect(): PDO {
        if (self::$instance === null) {
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ];

            // Primary attempt using configured DB_HOST
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // Shared Hosting Fallback: If 'localhost' socket failed, attempt direct TCP loopback '127.0.0.1'
                // This reliably fixes the common DirectAdmin socket mismatch (/tmp/mysql.sock vs /var/lib/mysql/mysql.sock)
                if (DB_HOST === 'localhost') {
                    try {
                        $fallbackDsn = "mysql:host=127.0.0.1;port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
                        self::$instance = new PDO($fallbackDsn, DB_USER, DB_PASS, $options);
                        return self::$instance;
                    } catch (PDOException $eFallback) {
                        // Pass through to error display below
                    }
                }

                // Render friendly diagnostic message instead of blank screen
                $dbName = htmlspecialchars(DB_NAME);
                $dbUser = htmlspecialchars(DB_USER);
                $errMsg = htmlspecialchars($e->getMessage());

                die("
                <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Database Setup Required - DevGenius Academy</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F2F6FF; color: #1E293B; padding: 40px 20px; line-height: 1.6; }
                        .card { max-width: 650px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 20px; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px rgba(6,26,58,0.08); }
                        .logo { font-size: 20px; font-weight: 800; color: #061A3A; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
                        .logo span { background: #F28C18; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 12px; }
                        h2 { color: #082592; margin-top: 0; font-size: 22px; }
                        .code { background: #061A3A; color: #F1F5F9; padding: 14px 18px; border-radius: 12px; font-family: monospace; font-size: 13px; overflow-x: auto; margin: 15px 0; border-left: 4px solid #F28C18; }
                        .tips { background: #EFF6FF; border-left: 4px solid #1746C5; padding: 14px 18px; margin-top: 20px; border-radius: 0 12px 12px 0; font-size: 13px; }
                        ol { padding-left: 20px; font-size: 13px; }
                        li { margin-bottom: 8px; }
                        .btn { display: inline-block; padding: 12px 24px; background: #F28C18; color: #fff; text-decoration: none; font-weight: 700; border-radius: 10px; font-size: 13px; margin-top: 15px; }
                        .btn:hover { background: #d9770e; }
                    </style>
                </head>
                <body>
                    <div class='card'>
                        <div class='logo'>DEVGENIUS <span>ACADEMY</span></div>
                        <h2>Database Connection Issue</h2>
                        <p>DevGenius Academy could not connect to MySQL using the settings in <code>includes/config.php</code>.</p>
                        
                        <div class='code'>$errMsg</div>

                        <p><strong>To resolve this automatically:</strong></p>
                        <a href='install.php' class='btn'>Run Automatic Database Installer →</a>

                        <div class='tips'>
                            <strong>Quick Shared Hosting Checks (cPanel & DirectAdmin):</strong>
                            <ol>
                                <li>Ensure you ran <code>install.php</code> which automatically imports tables and configures <code>includes/config.php</code>.</li>
                                <li><strong>cPanel:</strong> Verify database name is prefixed with your cPanel username (e.g. <code>{$dbName}</code>) and your user has <strong>ALL PRIVILEGES</strong> assigned.</li>
                                <li><strong>DirectAdmin:</strong> Go to <strong>MySQL Management</strong>, confirm the database and user are created.</li>
                            </ol>
                        </div>
                    </div>
                </body>
                </html>
                ");
            }
        }
        return self::$instance;
    }
}
