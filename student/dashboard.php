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
$stmtAssignments = $pdo->prepare("SELECT a.*, c.title AS course_title, s.id AS submission_id, s.status AS submission_status, s.score, s.grade, s.feedback 
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Portal - DevGenius Academy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4, .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-[#061A3A] text-slate-300 p-6 flex flex-col justify-between shrink-0">
        <div class="space-y-6">
            <a href="../index.php" class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-[#082592] text-white flex items-center justify-center font-bold text-sm">
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <div>
                    <span class="font-heading font-extrabold text-sm text-white">DEVGENIUS</span>
                    <span class="text-[10px] block text-[#F28C18] font-bold">STUDENT PORTAL</span>
                </div>
            </a>

            <div class="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-1">
                <div class="font-bold text-white"><?= sanitize($currentUser['full_name']) ?></div>
                <div class="text-[11px] text-slate-400"><?= sanitize($currentUser['email']) ?></div>
                <span class="inline-block px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">Student</span>
            </div>

            <nav class="space-y-1 text-xs font-semibold">
                <a href="dashboard.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-[#082592] text-white">
                    <i class="fa-solid fa-gauge-high"></i>
                    <span>Overview</span>
                </a>
                <a href="../courses.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <i class="fa-solid fa-book-open"></i>
                    <span>Browse Courses</span>
                </a>
                <a href="assignments.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <i class="fa-solid fa-file-pen"></i>
                    <span>Assignments & Grades</span>
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
    <main class="flex-1 p-6 sm:p-10 space-y-8 max-w-5xl overflow-y-auto">
        <!-- Banner -->
        <div class="bg-gradient-to-r from-[#082592] to-[#1746C5] rounded-3xl p-6 sm:p-8 text-white space-y-2 shadow-lg shadow-blue-900/10">
            <span class="text-xs font-bold text-[#F28C18] uppercase tracking-wider">DevGenius Learning Dashboard</span>
            <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Welcome back, <?= sanitize($currentUser['full_name']) ?>!
            </h1>
            <p class="text-xs text-blue-100 max-w-lg leading-relaxed">
                Track your active course syllabi, upload assignments for grading, and view detailed evaluations from instructors.
            </p>
        </div>

        <!-- Metrics Row -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div class="text-xs text-slate-500 font-semibold">Enrolled Courses</div>
                <div class="text-3xl font-heading font-extrabold text-[#082592] mt-1 tabular-nums"><?= count($enrolments) ?></div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div class="text-xs text-slate-500 font-semibold">Pending Assignments</div>
                <div class="text-3xl font-heading font-extrabold text-[#F28C18] mt-1 tabular-nums"><?= $pendingCount ?></div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div class="text-xs text-slate-500 font-semibold">Graded Submissions</div>
                <div class="text-3xl font-heading font-extrabold text-emerald-600 mt-1 tabular-nums"><?= $gradedCount ?></div>
            </div>
        </div>

        <!-- Enrolled Courses List -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div class="flex items-center justify-between">
                <h3 class="font-heading font-bold text-base text-slate-900">My Enrolled Courses</h3>
                <a href="../courses.php" class="text-xs font-bold text-[#082592] hover:underline">+ Enrol in More</a>
            </div>

            <?php if (empty($enrolments)): ?>
                <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <p class="text-xs text-slate-500">You have not enrolled in any courses yet.</p>
                    <a href="../courses.php" class="inline-block py-2 px-4 bg-[#082592] text-white text-xs font-bold rounded-xl">Browse Catalog</a>
                </div>
            <?php else: ?>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <?php foreach ($enrolments as $e): ?>
                        <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-bold text-[#082592] bg-blue-50 px-2 py-0.5 rounded">
                                    <?= sanitize($e['category']) ?>
                                </span>
                                <span class="text-xs text-slate-400 font-medium"><?= sanitize($e['duration']) ?></span>
                            </div>
                            <h4 class="font-heading font-bold text-sm text-slate-900"><?= sanitize($e['course_title']) ?></h4>
                            <div>
                                <div class="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                                    <span>Course Progress</span>
                                    <span class="font-bold text-slate-800"><?= $e['progress_percent'] ?>%</span>
                                </div>
                                <div class="w-full bg-slate-200 rounded-full h-2">
                                    <div class="bg-[#082592] h-2 rounded-full" style="width: <?= $e['progress_percent'] ?>%"></div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <!-- Assignments & Feedback -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div class="flex items-center justify-between">
                <h3 class="font-heading font-bold text-base text-slate-900">Recent Assignments</h3>
                <a href="assignments.php" class="text-xs font-bold text-[#082592] hover:underline">Submit Assignments →</a>
            </div>

            <?php if (empty($assignments)): ?>
                <p class="text-xs text-slate-500">No active assignments assigned to your enrolled courses.</p>
            <?php else: ?>
                <div class="space-y-3">
                    <?php foreach (array_slice($assignments, 0, 4) as $asg): ?>
                        <div class="p-4 rounded-2xl border border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                            <div class="space-y-1">
                                <div class="text-[11px] text-[#082592] font-semibold"><?= sanitize($asg['course_title']) ?></div>
                                <h4 class="font-heading font-bold text-sm text-slate-900"><?= sanitize($asg['title']) ?></h4>
                                <div class="text-[11px] text-slate-400">Due: <?= date('M d, Y', strtotime($asg['due_date'])) ?></div>
                            </div>

                            <div class="flex items-center gap-3">
                                <?php if ($asg['submission_status'] === 'Graded'): ?>
                                    <span class="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                        Grade: <?= sanitize($asg['grade'] ?? 'A') ?> (<?= $asg['score'] ?>/<?= $asg['max_score'] ?>)
                                    </span>
                                <?php elseif ($asg['submission_status'] === 'Submitted'): ?>
                                    <span class="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                                        Pending Review
                                    </span>
                                <?php else: ?>
                                    <a href="assignments.php?submit=<?= $asg['id'] ?>" class="py-1.5 px-3.5 bg-[#F28C18] text-white text-xs font-bold rounded-lg shadow-sm">
                                        Submit Work
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>
