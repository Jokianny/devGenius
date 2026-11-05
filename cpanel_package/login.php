<?php
$pageTitle = 'Login';
require_once __DIR__ . '/includes/header.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!empty($email) && !empty($password)) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];
            if ($user['role'] === 'admin') {
                header("Location: admin/dashboard.php");
            } else {
                header("Location: student/dashboard.php");
            }
            exit;
        } else {
            $error = 'Invalid email address or password.';
        }
    } else {
        $error = 'Please fill in both fields.';
    }
}
?>

<div class="max-w-md mx-auto my-16 px-4 w-full">
    <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-md space-y-6">
        <div>
            <h2 class="text-2xl font-heading font-extrabold text-slate-900">Sign In</h2>
            <p class="text-xs text-slate-500 mt-1">Access your DevGenius Academy student or administrator portal.</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                <?= sanitize($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php" class="space-y-4 text-xs">
            <div>
                <label class="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" name="email" required placeholder="name@example.com"
                       class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]">
            </div>

            <div>
                <label class="block font-semibold text-slate-700 mb-1">Password</label>
                <input type="password" name="password" required placeholder="••••••••"
                       class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]">
            </div>

            <button type="submit" class="w-full py-2.5 bg-[#082592] hover:bg-[#061A3A] text-white font-bold rounded-lg shadow-sm">
                Sign In
            </button>
        </form>

        <div class="pt-2 text-center text-xs text-slate-500">
            Don't have an account yet? <a href="register.php" class="text-[#F28C18] font-bold hover:underline">Register as Student</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
