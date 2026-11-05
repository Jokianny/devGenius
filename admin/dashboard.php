<?php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
require_once __DIR__ . '/../includes/auth.php';

$currentUser = require_admin();
$pdo = Database::connect();
$msg = '';

// Handle Grading Action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['grade_submission'])) {
    $submissionId = (int)$_POST['submission_id'];
    $score = (int)$_POST['score'];
    $grade = trim($_POST['grade'] ?? 'A');
    $feedback = trim($_POST['feedback'] ?? '');

    if ($submissionId > 0 && $score >= 0) {
        $stmtGrade = $pdo->prepare("UPDATE assignment_submissions 
                                    SET score = ?, grade = ?, feedback = ?, status = 'Graded', graded_at = CURRENT_TIMESTAMP 
                                    WHERE id = ?");
        $stmtGrade->execute([$score, $grade, $feedback, $submissionId]);
        $msg = '<div class="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl">Submission graded successfully! Student portal has been updated with feedback and marks.</div>';
    }
}

// Strict Requirement: Count ONLY student-role accounts, excluding administrator accounts!
$stmtStudents = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'");
$totalStudents = (int)$stmtStudents->fetchColumn();

$stmtCourses = $pdo->query("SELECT COUNT(*) FROM courses WHERE is_active = 1");
$totalCourses = (int)$stmtCourses->fetchColumn();

$stmtEnrolments = $pdo->query("SELECT COUNT(*) FROM course_enrolments");
$totalEnrolments = (int)$stmtEnrolments->fetchColumn();

$stmtPending = $pdo->query("SELECT COUNT(*) FROM assignment_submissions WHERE status = 'Submitted'");
$pendingGrading = (int)$stmtPending->fetchColumn();

$stmtGraded = $pdo->query("SELECT COUNT(*) FROM assignment_submissions WHERE status = 'Graded'");
$totalGraded = (int)$stmtGraded->fetchColumn();

// Fetch submissions awaiting grading
$stmtSubs = $pdo->query("SELECT s.*, u.full_name AS student_name, u.email AS student_email, a.title AS assignment_title, a.max_score, c.title AS course_title 
                         FROM assignment_submissions s 
                         JOIN users u ON s.user_id = u.id 
                         JOIN assignments a ON s.assignment_id = a.id 
                         JOIN courses c ON a.course_id = c.id 
                         ORDER BY s.status ASC, s.submitted_at DESC 
                         LIMIT 15");
$submissions = $stmtSubs->fetchAll();

// Fetch registered students (excluding admins)
$stmtStudentList = $pdo->query("SELECT u.id, u.full_name, u.email, u.phone, u.created_at, COUNT(ce.id) AS course_count 
                                FROM users u 
                                LEFT JOIN course_enrolments ce ON u.id = ce.user_id 
                                WHERE u.role = 'student' 
                                GROUP BY u.id 
                                ORDER BY u.created_at DESC 
                                LIMIT 10");
$students = $stmtStudentList->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrator Console - DevGenius Academy</title>
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
                <a href="dashboard.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-[#082592] text-white">
                    <i class="fa-solid fa-chart-line"></i>
                    <span>Overview & Grading</span>
                </a>
                <a href="courses.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <i class="fa-solid fa-book-open"></i>
                    <span>Manage Courses</span>
                </a>
                <a href="students.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
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
        <div>
            <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Live Platform Management</span>
            <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">
                Administrator Dashboard
            </h1>
            <p class="text-xs text-slate-500">Live statistics queried strictly from MySQL database records.</p>
        </div>

        <?php if ($msg) echo $msg; ?>

        <!-- Prominent Metrics Row -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="p-5 bg-blue-50 border-2 border-[#082592] rounded-2xl shadow-xs">
                <div class="text-[11px] font-bold text-[#082592] uppercase">Registered Students</div>
                <div class="text-3xl font-heading font-extrabold text-[#061A3A] mt-1 tabular-nums"><?= $totalStudents ?></div>
                <div class="text-[10px] text-blue-700 mt-0.5 font-medium">Excludes administrator accounts</div>
            </div>

            <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div class="text-[11px] font-semibold text-slate-500">Available Courses</div>
                <div class="text-2xl font-heading font-extrabold text-[#082592] mt-1 tabular-nums"><?= $totalCourses ?></div>
            </div>

            <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div class="text-[11px] font-semibold text-slate-500">Total Enrolments</div>
                <div class="text-2xl font-heading font-extrabold text-blue-600 mt-1 tabular-nums"><?= $totalEnrolments ?></div>
            </div>

            <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div class="text-[11px] font-semibold text-slate-500">Pending Review</div>
                <div class="text-2xl font-heading font-extrabold text-[#F28C18] mt-1 tabular-nums"><?= $pendingGrading ?></div>
            </div>

            <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div class="text-[11px] font-semibold text-slate-500">Graded Projects</div>
                <div class="text-2xl font-heading font-extrabold text-emerald-600 mt-1 tabular-nums"><?= $totalGraded ?></div>
            </div>
        </div>

        <!-- Student Assignment Grading Queue -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">Student Assignment Submissions & Grading</h3>
                    <p class="text-xs text-slate-500">Review student uploaded projects, enter marks and feedback.</p>
                </div>
                <span class="text-xs font-bold text-[#F28C18] bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                    <?= $pendingGrading ?> Pending Review
                </span>
            </div>

            <?php if (empty($submissions)): ?>
                <p class="text-xs text-slate-500">No project submissions recorded in the database yet.</p>
            <?php else: ?>
                <div class="space-y-4">
                    <?php foreach ($submissions as $sub): ?>
                        <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="font-heading font-bold text-sm text-slate-900"><?= sanitize($sub['student_name']) ?></span>
                                        <span class="text-xs text-slate-400">&lt;<?= sanitize($sub['student_email']) ?>&gt;</span>
                                    </div>
                                    <div class="text-xs text-[#082592] font-semibold mt-0.5">
                                        <?= sanitize($sub['course_title']) ?> · <span class="text-slate-700"><?= sanitize($sub['assignment_title']) ?></span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-3 text-xs">
                                    <span class="px-2.5 py-1 rounded-lg text-xs font-bold <?= $sub['status'] === 'Graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800' ?>">
                                        <?= $sub['status'] ?>
                                    </span>
                                    <span class="text-slate-400 font-medium"><?= date('M d, H:i', strtotime($sub['submitted_at'])) ?></span>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span class="text-slate-400 block font-semibold">Attached Project File:</span>
                                    <div class="font-mono bg-white px-3 py-1.5 border border-slate-200 rounded-lg inline-block text-slate-800 font-medium mt-1">
                                        <i class="fa-solid fa-file-arrow-down mr-1.5 text-[#082592]"></i><?= sanitize($sub['file_name']) ?> (<?= sanitize($sub['file_size']) ?>)
                                    </div>
                                    <?php if (!empty($sub['comments'])): ?>
                                        <p class="text-slate-500 mt-2 italic">Student Note: "<?= sanitize($sub['comments']) ?>"</p>
                                    <?php endif; ?>
                                </div>

                                <!-- Inline Grading Form -->
                                <form method="POST" action="dashboard.php" class="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                                    <input type="hidden" name="submission_id" value="<?= $sub['id'] ?>">

                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <label class="block font-bold text-slate-700 mb-1">Score (out of <?= $sub['max_score'] ?>)</label>
                                            <input type="number" name="score" required min="0" max="<?= $sub['max_score'] ?>" 
                                                   value="<?= $sub['score'] ?? 90 ?>"
                                                   class="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs">
                                        </div>
                                        <div>
                                            <label class="block font-bold text-slate-700 mb-1">Grade (A/B/C/D)</label>
                                            <input type="text" name="grade" required value="<?= sanitize($sub['grade'] ?? 'A') ?>"
                                                   class="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs">
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block font-bold text-slate-700 mb-1">Instructor Feedback</label>
                                        <input type="text" name="feedback" placeholder="e.g. Clean code and responsive UI..."
                                               value="<?= sanitize($sub['feedback'] ?? '') ?>"
                                               class="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs">
                                    </div>

                                    <button type="submit" name="grade_submission" 
                                            class="w-full py-2 bg-[#082592] hover:bg-[#061A3A] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer">
                                        Save & Update Grade →
                                    </button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <!-- Registered Students Table -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 class="font-heading font-bold text-base text-slate-900">Registered Students (role = student)</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
                        <tr>
                            <th class="p-3">ID</th>
                            <th class="p-3">Full Name</th>
                            <th class="p-3">Email Address</th>
                            <th class="p-3">Phone</th>
                            <th class="p-3">Enrolled Courses</th>
                            <th class="p-3">Registered On</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($students as $stu): ?>
                            <tr class="hover:bg-slate-50/80">
                                <td class="p-3 font-mono font-bold text-slate-900">#<?= $stu['id'] ?></td>
                                <td class="p-3 font-bold text-slate-800"><?= sanitize($stu['full_name']) ?></td>
                                <td class="p-3"><?= sanitize($stu['email']) ?></td>
                                <td class="p-3"><?= sanitize($stu['phone']) ?></td>
                                <td class="p-3"><span class="px-2 py-0.5 rounded bg-blue-50 text-[#082592] font-bold"><?= $stu['course_count'] ?> active</span></td>
                                <td class="p-3 text-slate-400"><?= date('M d, Y', strtotime($stu['created_at'])) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</body>
</html>
