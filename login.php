<?php
$pageTitle = 'Sign In';
$activeNav = 'login';
require_once __DIR__ . '/includes/header.php';

$error = '';
$redirect = $_GET['redirect'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim(strtolower($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';
    $redirect = $_POST['redirect'] ?? '';

    if (!empty($email) && !empty($password)) {
        try {
            $pdo = Database::connect();
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['role'] = $user['role'];

                if (!empty($redirect) && !str_starts_with($redirect, 'http')) {
                    header("Location: " . $redirect);
                    exit;
                }

                if ($user['role'] === 'admin') {
                    header("Location: admin/dashboard.php");
                } else {
                    header("Location: student/dashboard.php");
                }
                exit;
            } else {
                $error = 'Invalid email address or password.';
            }
        } catch (Exception $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    } else {
        $error = 'Please fill in both fields.';
    }
}
?>

<div class="max-w-md mx-auto my-16 px-4 w-full">
    <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div class="text-center space-y-1">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 text-[#082592] mx-auto flex items-center justify-center text-xl font-bold">
                <i class="fa-solid fa-lock"></i>
            </div>
            <h2 class="text-2xl font-heading font-extrabold text-[#061A3A] pt-2">Sign In</h2>
            <p class="text-xs text-slate-500">Access your DevGenius Academy student or administrator portal.</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 leading-relaxed">
                <?= sanitize($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php" class="space-y-4 text-xs">
            <input type="hidden" name="redirect" value="<?= sanitize($redirect) ?>">

            <div>
                <label class="block font-bold text-slate-800 mb-1">Email Address</label>
                <input type="email" name="email" required placeholder="admin@devgenius.academy"
                       value="<?= sanitize($_POST['email'] ?? '') ?>"
                       class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
            </div>

            <div>
                <label class="block font-bold text-slate-800 mb-1">Password</label>
                <input type="password" name="password" required placeholder="••••••••"
                       class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
            </div>

            <button type="submit" class="w-full py-3 bg-[#082592] hover:bg-[#061A3A] text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer">
                Sign In to Portal →
            </button>
        </form>

        <!-- Demo Accounts Helper Box -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
            <div class="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Default Demonstration Logins:</div>
            <div class="space-y-1 text-slate-600 text-[11px]">
                <div><strong>Admin:</strong> <code>admin@devgenius.academy</code> / <code>Password123!</code></div>
                <div><strong>Student:</strong> <code>sarah.mensah@example.com</code> / <code>Password123!</code></div>
            </div>
        </div>

        <div class="pt-2 text-center text-xs text-slate-500">
            Don't have an account yet? <a href="register.php" class="text-[#F28C18] font-bold hover:underline">Register as a Student</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
