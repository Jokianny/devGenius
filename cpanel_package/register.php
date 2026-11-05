<?php
$pageTitle = 'Student Registration';
$activeNav = 'register';
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
        try {
            $pdo = Database::connect();
            $stmtCheck = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmtCheck->execute([$email]);
            if ($stmtCheck->fetch()) {
                $error = 'An account with this email address already exists.';
            } else {
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
                // Strict requirement: Role is student
                $stmtInsert = $pdo->prepare("INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, 'student')");
                $stmtInsert->execute([$full_name, $email, $phone, $hashedPassword]);
                
                $_SESSION['user_id'] = $pdo->lastInsertId();
                $_SESSION['role'] = 'student';
                header("Location: student/dashboard.php?registered=1");
                exit;
            }
        } catch (Exception $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    }
}
?>

<div class="max-w-md mx-auto my-14 px-4 w-full">
    <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div class="text-center space-y-1">
            <div class="w-12 h-12 rounded-2xl bg-[#F28C18]/15 text-[#F28C18] mx-auto flex items-center justify-center text-xl font-bold">
                <i class="fa-solid fa-user-plus"></i>
            </div>
            <h2 class="text-2xl font-heading font-extrabold text-[#061A3A] pt-2">Student Registration</h2>
            <p class="text-xs text-slate-500">Create your free account to enrol in courses and access learning modules.</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 leading-relaxed">
                <?= sanitize($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="register.php" class="space-y-4 text-xs">
            <div>
                <label class="block font-bold text-slate-800 mb-1">Full Name</label>
                <input type="text" name="full_name" required placeholder="Samuel Adekunle"
                       value="<?= sanitize($_POST['full_name'] ?? '') ?>"
                       class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
            </div>

            <div>
                <label class="block font-bold text-slate-800 mb-1">Email Address</label>
                <input type="email" name="email" required placeholder="samuel@gmail.com"
                       value="<?= sanitize($_POST['email'] ?? '') ?>"
                       class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
            </div>

            <div>
                <label class="block font-bold text-slate-800 mb-1">Phone Number</label>
                <input type="tel" name="phone" required placeholder="+234 800 000 0000"
                       value="<?= sanitize($_POST['phone'] ?? '') ?>"
                       class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-slate-800 mb-1">Password</label>
                    <input type="password" name="password" required placeholder="Min 6 chars"
                           class="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
                </div>
                <div>
                    <label class="block font-bold text-slate-800 mb-1">Confirm Password</label>
                    <input type="password" name="confirm_password" required placeholder="Repeat password"
                           class="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100">
                </div>
            </div>

            <button type="submit" class="w-full py-3 bg-[#F28C18] hover:bg-[#d9770e] text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer">
                Create Free Account →
            </button>
        </form>

        <div class="pt-2 text-center text-xs text-slate-500">
            Already have an account? <a href="login.php" class="text-[#082592] font-bold hover:underline">Sign In here</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
