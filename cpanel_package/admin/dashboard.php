<?php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
require_once __DIR__ . '/../includes/auth.php';

$currentUser = require_admin();
$pdo = Database::connect();

// Strict Requirement: Count ONLY student-role accounts, excluding administrator accounts!
$stmtStudents = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'");
$totalStudents = (int)$stmtStudents->fetchColumn();

$stmtCourses = $pdo->query("SELECT COUNT(*) FROM courses WHERE is_active = 1");
$totalCourses = (int)$stmtCourses->fetchColumn();

$stmtEnrolments = $pdo->query("SELECT COUNT(*) FROM course_enrolments");
$totalEnrolments = (int)$stmtEnrolments->fetchColumn();

$stmtSubmissions = $pdo->query("SELECT COUNT(*) FROM assignment_submissions");
$totalSubmissions = (int)$stmtSubmissions->fetchColumn();

$stmtPending = $pdo->query("SELECT COUNT(*) FROM assignment_submissions WHERE status = 'Submitted'");
$pendingGrading = (int)$stmtPending->fetchColumn();

$stmtGraded = $pdo->query("SELECT COUNT(*) FROM assignment_submissions WHERE status = 'Graded'");
$totalGraded = (int)$stmtGraded->fetchColumn();

// Fetch recent submissions
$stmtRecent = $pdo->query("SELECT s.*, u.full_name AS student_name, a.title AS assignment_title, c.title AS course_title 
                           FROM assignment_submissions s 
                           JOIN users u ON s.user_id = u.id 
                           JOIN assignments a ON s.assignment_id = a.id 
                           JOIN courses c ON a.course_id = c.id 
                           ORDER BY s.submitted_at DESC LIMIT 10");
$recentSubmissions = $stmtRecent->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Administrator Dashboard - DevGenius Academy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'DM Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col md:flex-row">
    <!-- Admin Sidebar -->
    <aside class="w-full md:w-64 bg-[#061A3A] text-slate-300 p-6 flex flex-col justify-between shrink-0">
        <div class="space-y-6">
            <a href="../index.php" class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-[#F28C18] text-white flex items-center justify-center font-bold text-sm">DG</div>
                <div>
                    <span class="font-heading font-extrabold text-sm text-white">DEVGENIUS</span>
                    <span class="text-[10px] block text-[#F28C18] font-bold">ADMIN CONSOLE</span>
                </div>
            </a>

            <div class="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                <div class="font-bold text-white"><?= sanitize($currentUser['full_name']) ?></div>
                <div class="text-[11px] text-amber-400 font-semibold">Administrator</div>
            </div>

            <nav class="space-y-1 text-xs font-semibold">
                <a href="dashboard.php" class="block py-2.5 px-3 rounded-lg bg-[#082592] text-white">Overview</a>
                <a href="../index.php" class="block py-2.5 px-3 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white">Public Site</a>
            </nav>
        </div>

        <div class="pt-6 border-t border-white/10 text-xs">
            <a href="../logout.php" class="text-rose-400 hover:underline">Log Out</a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 sm:p-10 space-y-8 max-w-5xl overflow-y-auto">
        <div>
            <span class="text-xs font-bold text-[#082592] uppercase">Live Server Database</span>
            <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">
                Admin Management Console
            </h1>
            <p class="text-xs text-slate-500">Live statistics queried from MySQL (cPanel / DirectAdmin Apache backend).</p>
        </div>

        <!-- Prominent Metrics Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div class="p-4 bg-blue-50 border-2 border-[#082592] rounded-2xl">
                <div class="text-[11px] font-bold text-[#082592] uppercase">Registered Students</div>
                <div class="text-3xl font-heading font-extrabold text-[#061A3A] mt-1 tabular-nums"><?= $totalStudents ?></div>
                <div class="text-[10px] text-blue-700 mt-0.5">Excludes admin</div>
            </div>
            <div class="p-4 bg-white border border-slate-200 rounded-2xl">
                <div class="text-[11px] font-semibold text-slate-500">Available Courses</div>
                <div class="text-2xl font-heading font-extrabold text-[#082592] mt-1 tabular-nums"><?= $totalCourses ?></div>
            </div>
            <div class="p-4 bg-white border border-slate-200 rounded-2xl">
                <div class="text-[11px] font-semibold text-slate-500">Total Enrolments</div>
                <div class="text-2xl font-heading font-extrabold text-blue-600 mt-1 tabular-nums"><?= $totalEnrolments ?></div>
            </div>
            <div class="p-4 bg-white border border-slate-200 rounded-2xl">
                <div class="text-[11px] font-semibold text-slate-500">Submissions</div>
                <div class="text-2xl font-heading font-extrabold text-slate-800 mt-1 tabular-nums"><?= $totalSubmissions ?></div>
            </div>
            <div class="p-4 bg-white border border-amber-200 bg-amber-50/40 rounded-2xl">
                <div class="text-[11px] font-semibold text-amber-800">Pending Grading</div>
                <div class="text-2xl font-heading font-extrabold text-[#F28C18] mt-1 tabular-nums"><?= $pendingGrading ?></div>
            </div>
            <div class="p-4 bg-white border border-emerald-200 bg-emerald-50/40 rounded-2xl">
                <div class="text-[11px] font-semibold text-emerald-800">Graded Work</div>
                <div class="text-2xl font-heading font-extrabold text-emerald-600 mt-1 tabular-nums"><?= $totalGraded ?></div>
            </div>
        </div>

        <!-- Recent Submissions Table -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 class="font-heading font-bold text-base text-slate-900">Student Assignment Submissions Queue</h3>
            <?php if (empty($recentSubmissions)): ?>
                <p class="text-xs text-slate-500 p-6 text-center">No assignment submissions yet.</p>
            <?php else: ?>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <tr>
                                <th class="py-2.5 px-3">Student</th>
                                <th class="py-2.5 px-3">Course / Assignment</th>
                                <th class="py-2.5 px-3">File</th>
                                <th class="py-2.5 px-3">Status</th>
                                <th class="py-2.5 px-3">Score</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($recentSubmissions as $s): ?>
                                <tr>
                                    <td class="py-2.5 px-3 font-semibold"><?= sanitize($s['student_name']) ?></td>
                                    <td class="py-2.5 px-3"><?= sanitize($s['assignment_title']) ?></td>
                                    <td class="py-2.5 px-3 font-mono text-[11px]"><?= sanitize($s['file_name']) ?></td>
                                    <td class="py-2.5 px-3">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $s['status'] === 'Graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800' ?>">
                                            <?= sanitize($s['status']) ?>
                                        </span>
                                    </td>
                                    <td class="py-2.5 px-3 font-bold"><?= $s['score'] !== null ? $s['score'] . '/100' : '—' ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>
