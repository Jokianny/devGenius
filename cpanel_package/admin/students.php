<?php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
require_once __DIR__ . '/../includes/auth.php';

$currentUser = require_admin();
$pdo = Database::connect();

$search = trim($_GET['q'] ?? '');

$sql = "SELECT u.id, u.full_name, u.email, u.phone, u.created_at, 
               COUNT(DISTINCT ce.id) AS course_count,
               COUNT(DISTINCT s.id) AS submission_count
        FROM users u 
        LEFT JOIN course_enrolments ce ON u.id = ce.user_id 
        LEFT JOIN assignment_submissions s ON u.id = s.user_id 
        WHERE u.role = 'student'";

$params = [];
if (!empty($search)) {
    $sql .= " AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

$sql .= " GROUP BY u.id ORDER BY u.created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$students = $stmt->fetchAll();

// Total student count (Strictly excluding admins)
$totalCount = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Directory - DevGenius Academy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4, .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col md:flex-row">
    <!-- Admin Sidebar -->
    <aside class="w-full md:w-64 bg-[#061A3A] text-slate-300 p-6 flex flex-col justify-between shrink-0">
        <div class="space-y-6">
            <a href="../index.php" class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-[#F28C18] text-white flex items-center justify-center font-bold text-sm">
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <div>
                    <span class="font-heading font-extrabold text-sm text-white">DEVGENIUS</span>
                    <span class="text-[10px] block text-[#F28C18] font-bold">ADMIN CONSOLE</span>
                </div>
            </a>

            <div class="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-1">
                <div class="font-bold text-white"><?= sanitize($currentUser['full_name']) ?></div>
                <div class="text-[11px] text-amber-400 font-semibold">Administrator</div>
            </div>

            <nav class="space-y-1 text-xs font-semibold">
                <a href="dashboard.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <i class="fa-solid fa-chart-line"></i>
                    <span>Overview & Grading</span>
                </a>
                <a href="courses.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <i class="fa-solid fa-book-open"></i>
                    <span>Manage Courses</span>
                </a>
                <a href="students.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-[#082592] text-white">
                    <i class="fa-solid fa-user-graduate"></i>
                    <span>Manage Students</span>
                </a>
                <a href="../index.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <i class="fa-solid fa-house"></i>
                    <span>Public Home</span>
                </a>
            </nav>
        </div>

        <div class="pt-6 border-t border-white/10 text-xs">
            <a href="../logout.php" class="flex items-center gap-2 text-rose-400 hover:underline">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Log Out</span>
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 sm:p-10 space-y-8 max-w-6xl overflow-y-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Learner Database</span>
                <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">
                    Registered Students
                </h1>
                <p class="text-xs text-slate-500">Strictly tracks student registrations (role = 'student'), excluding administrator accounts.</p>
            </div>
            <div class="py-2 px-4 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-[#082592] self-start">
                Total Students: <?= $totalCount ?>
            </div>
        </div>

        <!-- Search Bar -->
        <form method="GET" action="students.php" class="flex gap-2 max-w-md">
            <input type="text" name="q" value="<?= sanitize($search) ?>" placeholder="Search student name, email, or phone..."
                   class="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]">
            <button type="submit" class="py-2 px-4 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-xs">
                Search
            </button>
        </form>

        <!-- Students Table -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
                        <tr>
                            <th class="p-3">ID</th>
                            <th class="p-3">Full Name</th>
                            <th class="p-3">Email Address</th>
                            <th class="p-3">Phone</th>
                            <th class="p-3">Enrolled Courses</th>
                            <th class="p-3">Submissions</th>
                            <th class="p-3">Registered On</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php if (empty($students)): ?>
                            <tr>
                                <td colspan="7" class="p-6 text-center text-slate-400">No student accounts found.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($students as $stu): ?>
                                <tr class="hover:bg-slate-50/80">
                                    <td class="p-3 font-mono font-bold text-slate-900">#<?= $stu['id'] ?></td>
                                    <td class="p-3 font-bold text-slate-800"><?= sanitize($stu['full_name']) ?></td>
                                    <td class="p-3 text-slate-600"><?= sanitize($stu['email']) ?></td>
                                    <td class="p-3 text-slate-600"><?= sanitize($stu['phone']) ?></td>
                                    <td class="p-3">
                                        <span class="px-2 py-0.5 rounded bg-blue-50 text-[#082592] font-bold">
                                            <?= $stu['course_count'] ?> courses
                                        </span>
                                    </td>
                                    <td class="p-3">
                                        <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold">
                                            <?= $stu['submission_count'] ?> projects
                                        </span>
                                    </td>
                                    <td class="p-3 text-slate-400"><?= date('M d, Y', strtotime($stu['created_at'])) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</body>
</html>
