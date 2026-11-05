<?php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
require_once __DIR__ . '/../includes/auth.php';

$currentUser = require_student();
$pdo = Database::connect();

// Fetch enrolled courses for this student
$stmtEnrolments = $pdo->prepare("SELECT ce.*, c.title AS course_title, c.category, c.duration 
                                  FROM course_enrolments ce 
                                  JOIN courses c ON ce.course_id = c.id 
                                  WHERE ce.user_id = ?");
$stmtEnrolments->execute([$currentUser['id']]);
$enrolments = $stmtEnrolments->fetchAll();

// Fetch assignments and student submissions
$stmtAssignments = $pdo->prepare("SELECT a.*, c.title AS course_title, s.id AS submission_id, s.status AS submission_status, s.score 
                                   FROM assignments a 
                                   JOIN course_enrolments ce ON a.course_id = ce.course_id 
                                   JOIN courses c ON a.course_id = c.id 
                                   LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.user_id = ? 
                                   WHERE ce.user_id = ? 
                                   ORDER BY a.due_date ASC");
$stmtAssignments->execute([$currentUser['id'], $currentUser['id']]);
$assignments = $stmtAssignments->fetchAll();

$pendingCount = 0;
$gradedCount = 0;
foreach ($assignments as $asg) {
    if (empty($asg['submission_id'])) $pendingCount++;
    elseif ($asg['submission_status'] === 'Graded') $gradedCount++;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Dashboard - DevGenius Academy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'DM Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-[#061A3A] text-slate-300 p-6 flex flex-col justify-between shrink-0">
        <div class="space-y-6">
            <a href="../index.php" class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-[#082592] text-white flex items-center justify-center font-bold text-sm">DG</div>
                <span class="font-heading font-extrabold text-sm text-white">DEVGENIUS ACADEMY</span>
            </a>

            <div class="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                <div class="font-bold text-white"><?= sanitize($currentUser['full_name']) ?></div>
                <div class="text-[11px] text-slate-400"><?= sanitize($currentUser['email']) ?></div>
            </div>

            <nav class="space-y-1 text-xs font-semibold">
                <a href="dashboard.php" class="block py-2.5 px-3 rounded-lg bg-[#082592] text-white">Overview</a>
                <a href="../courses.php" class="block py-2.5 px-3 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white">Browse Courses</a>
                <a href="assignments.php" class="block py-2.5 px-3 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white">Assignments</a>
            </nav>
        </div>

        <div class="pt-6 border-t border-white/10 text-xs">
            <a href="../logout.php" class="text-rose-400 hover:underline">Log Out</a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 sm:p-10 space-y-8 max-w-5xl overflow-y-auto">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-[#082592] to-[#1746C5] rounded-2xl p-6 sm:p-8 text-white space-y-2">
            <span class="text-xs font-bold text-[#F28C18] uppercase">Student Portal</span>
            <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Welcome back, <?= sanitize($currentUser['full_name']) ?>!
            </h1>
            <p class="text-xs text-blue-100 max-w-lg">Track your enrolled curriculum modules, submit files for practical grading, and check your marks.</p>
        </div>

        <!-- Metrics Cards -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200">
                <div class="text-xs text-slate-500 font-semibold">Enrolled Courses</div>
                <div class="text-3xl font-heading font-extrabold text-[#082592] mt-1 tabular-nums"><?= count($enrolments) ?></div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200">
                <div class="text-xs text-slate-500 font-semibold">Pending Assignments</div>
                <div class="text-3xl font-heading font-extrabold text-[#F28C18] mt-1 tabular-nums"><?= $pendingCount ?></div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200">
                <div class="text-xs text-slate-500 font-semibold">Graded Submissions</div>
                <div class="text-3xl font-heading font-extrabold text-emerald-600 mt-1 tabular-nums"><?= $gradedCount ?></div>
            </div>
        </div>

        <!-- Enrolled Courses -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 class="font-heading font-bold text-base text-slate-900">My Enrolled Courses</h3>
            <?php if (empty($enrolments)): ?>
                <div class="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    You have not enrolled in any courses yet. <a href="../courses.php" class="text-[#082592] font-bold hover:underline">Explore courses</a>
                </div>
            <?php else: ?>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <?php foreach ($enrolments as $e): ?>
                        <div class="p-4 rounded-xl border border-slate-200 space-y-2">
                            <span class="text-[10px] font-bold text-[#082592] bg-blue-50 px-2 py-0.5 rounded"><?= sanitize($e['category']) ?></span>
                            <h4 class="font-heading font-bold text-sm text-slate-900"><?= sanitize($e['course_title']) ?></h4>
                            <div class="text-xs text-slate-500">Progress: <?= (int)$e['progress_percent'] ?>%</div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div class="bg-[#082592] h-full rounded-full" style="width: <?= (int)$e['progress_percent'] ?>%"></div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>
