<?php
$pageTitle = 'Student Registration';
require_once __DIR__ . '/includes/header.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = trim($_POST['full_name'] ?? '');
    $email = trim(strtolower($_POST['email'] ?? ''));
    $phone = trim($_POST['phone'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    if (empty($full_name) || empty($email) || empty($phone) || empty($password)) {
        $error = 'All fields are required.';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters.';
    } else {
        $pdo = Database::connect();
        $stmtCheck = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmtCheck->execute([$email]);
        if ($stmtCheck->fetch()) {
            $error = 'An account with this email address already exists.';
        } else {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            // Strict security: Role is hardcoded to 'student' to prevent privilege escalation
            $stmtInsert = $pdo->prepare("INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, 'student')");
            $stmtInsert->execute([$full_name, $email, $phone, $hashedPassword]);
            
            $_SESSION['user_id'] = $pdo->lastInsertId();
            $_SESSION['role'] = 'student';
            header("Location: student/dashboard.php?registered=1");
            exit;
        }
    }
}
?>

<div class="max-w-md mx-auto my-14 px-4 w-full">
    <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-md space-y-6">
        <div>
            <h2 class="text-2xl font-heading font-extrabold text-slate-900">Student Registration</h2>
            <p class="text-xs text-slate-500 mt-1">Create your free account to enrol in courses and access learning modules.</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                <?= sanitize($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="register.php" class="space-y-3.5 text-xs">
            <div>
                <label class="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" name="full_name" required placeholder="Samuel Adekunle"
                       class="w-full px-3 py-2 border border-slate-200 rounded-lg">
            </div>

            <div>
                <label class="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" name="email" required placeholder="samuel@gmail.com"
                       class="w-full px-3 py-2 border border-slate-200 rounded-lg">
            </div>

            <div>
                <label class="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input type="tel" name="phone" required placeholder="+234 800 000 0000"
                       class="w-full px-3 py-2 border border-slate-200 rounded-lg">
            </div>

            <div class="grid grid-cols-2 gap-2.5">
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Password</label>
                    <input type="password" name="password" required placeholder="Min 6 chars"
                           class="w-full px-3 py-2 border border-slate-200 rounded-lg">
                </div>
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Confirm Password</label>
                    <input type="password" name="confirm_password" required placeholder="Repeat password"
                           class="w-full px-3 py-2 border border-slate-200 rounded-lg">
                </div>
            </div>

            <button type="submit" class="w-full py-2.5 bg-[#F28C18] hover:bg-[#d9770e] text-white font-bold rounded-lg shadow-sm">
                Create Free Account
            </button>
        </form>

        <div class="pt-2 text-center text-xs text-slate-500">
            Already have an account? <a href="login.php" class="text-[#082592] font-bold hover:underline">Sign In</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
