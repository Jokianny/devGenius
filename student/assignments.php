<?php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
require_once __DIR__ . '/../includes/auth.php';

$currentUser = require_student();
$pdo = Database::connect();
$msg = '';

// Handle Assignment File Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['assignment_id'])) {
    $assignment_id = (int)$_POST['assignment_id'];
    $comments = trim($_POST['comments'] ?? '');

    if ($assignment_id <= 0) {
        $msg = '<div class="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl">Invalid assignment selected.</div>';
    } elseif (empty($_FILES['submission_file']['name'])) {
        $msg = '<div class="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl">Please select a file to upload.</div>';
    } else {
        $fileName = basename($_FILES['submission_file']['name']);
        $fileSize = $_FILES['submission_file']['size'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Allowed upload formats
        $allowed = ['zip', 'rar', 'pdf', 'py', 'js', 'html', 'css', 'docx', 'txt', 'png', 'jpg'];
        if (!in_array($fileExt, $allowed)) {
            $msg = '<div class="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl">Forbidden file format. Allowed: ' . implode(', ', $allowed) . '</div>';
        } else {
            $targetDir = __DIR__ . '/../uploads/assignments/';
            if (!is_dir($targetDir)) {
                @mkdir($targetDir, 0755, true);
            }
            $safeFileName = 'sub_' . $currentUser['id'] . '_' . time() . '.' . $fileExt;
            $destination = $targetDir . $safeFileName;

            if (move_uploaded_file($_FILES['submission_file']['tmp_name'], $destination)) {
                $fileSizeReadable = round($fileSize / 1024 / 1024, 2) . ' MB';
                if ($fileSize < 1024 * 1024) {
                    $fileSizeReadable = round($fileSize / 1024, 1) . ' KB';
                }

                $stmtSub = $pdo->prepare("INSERT INTO assignment_submissions 
                    (assignment_id, user_id, file_path, file_name, file_size, comments, status) 
                    VALUES (?, ?, ?, ?, ?, ?, 'Submitted') 
                    ON DUPLICATE KEY UPDATE 
                    file_path = VALUES(file_path), file_name = VALUES(file_name), file_size = VALUES(file_size), 
                    comments = VALUES(comments), status = 'Submitted', submitted_at = CURRENT_TIMESTAMP");
                $stmtSub->execute([
                    $assignment_id, 
                    $currentUser['id'], 
                    'uploads/assignments/' . $safeFileName, 
                    $fileName, 
                    $fileSizeReadable, 
                    $comments
                ]);
                $msg = '<div class="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl">Assignment submitted successfully! An instructor will grade your project shortly.</div>';
            } else {
                $msg = '<div class="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl">Failed to upload file. Check permissions on uploads/ folder.</div>';
            }
        }
    }
}

// Fetch all enrolled assignments
$stmtAssignments = $pdo->prepare("SELECT a.*, c.title AS course_title, s.id AS submission_id, s.file_name, s.status AS submission_status, s.score, s.grade, s.feedback, s.submitted_at 
                                   FROM assignments a 
                                   JOIN course_enrolments ce ON a.course_id = ce.course_id 
                                   JOIN courses c ON a.course_id = c.id 
                                   LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.user_id = ? 
                                   WHERE ce.user_id = ? 
                                   ORDER BY a.due_date ASC");
$stmtAssignments->execute([$currentUser['id'], $currentUser['id']]);
$assignments = $stmtAssignments->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Assignments & Grades - DevGenius Academy</title>
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
            </div>

            <nav class="space-y-1 text-xs font-semibold">
                <a href="dashboard.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <i class="fa-solid fa-gauge-high"></i>
                    <span>Overview</span>
                </a>
                <a href="../courses.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <i class="fa-solid fa-book-open"></i>
                    <span>Browse Courses</span>
                </a>
                <a href="assignments.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-[#082592] text-white">
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
        <div>
            <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Evaluation & Grading</span>
            <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">
                Course Assignments & Project Submissions
            </h1>
            <p class="text-xs text-slate-500">Upload your completed task files directly to the server for evaluation.</p>
        </div>

        <?php if ($msg) echo $msg; ?>

        <?php if (empty($assignments)): ?>
            <div class="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                <p class="text-xs text-slate-500">You do not have any active assignments yet. Enrol in courses to get assigned practical tasks.</p>
                <a href="../courses.php" class="inline-block py-2.5 px-5 bg-[#082592] text-white text-xs font-bold rounded-xl">Browse Catalog</a>
            </div>
        <?php else: ?>
            <div class="space-y-6">
                <?php foreach ($assignments as $asg): ?>
                    <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                            <div>
                                <span class="text-[10px] font-bold text-[#082592] bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                                    <?= sanitize($asg['course_title']) ?>
                                </span>
                                <h3 class="font-heading font-bold text-lg text-slate-900 mt-2"><?= sanitize($asg['title']) ?></h3>
                            </div>
                            <div class="text-xs text-slate-500 font-medium">
                                <i class="fa-regular fa-calendar mr-1"></i>Due Date: <strong><?= date('M d, Y', strtotime($asg['due_date'])) ?></strong>
                            </div>
                        </div>

                        <p class="text-xs text-slate-600 leading-relaxed"><?= sanitize($asg['description']) ?></p>

                        <!-- Evaluation Status Bar -->
                        <?php if ($asg['submission_status'] === 'Graded'): ?>
                            <div class="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                                        <i class="fa-solid fa-circle-check"></i>
                                        <span>Graded by Instructor</span>
                                    </span>
                                    <span class="text-sm font-heading font-extrabold text-emerald-700">
                                        Score: <?= $asg['score'] ?>/<?= $asg['max_score'] ?> (Grade <?= sanitize($asg['grade'] ?? 'A') ?>)
                                    </span>
                                </div>
                                <?php if (!empty($asg['feedback'])): ?>
                                    <div class="text-xs text-emerald-900/90 pt-1">
                                        <strong>Teacher Feedback:</strong> <?= sanitize($asg['feedback']) ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php elseif ($asg['submission_status'] === 'Submitted'): ?>
                            <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-800 font-semibold">
                                <span><i class="fa-solid fa-clock mr-1.5"></i>Submitted: <?= sanitize($asg['file_name']) ?> — Pending Evaluation</span>
                                <span class="text-[11px] text-slate-500">Submitted on <?= date('M d, H:i', strtotime($asg['submitted_at'])) ?></span>
                            </div>
                        <?php endif; ?>

                        <!-- Submission Form -->
                        <form method="POST" action="assignments.php" enctype="multipart/form-data" class="pt-2 border-t border-slate-100 space-y-3 text-xs">
                            <input type="hidden" name="assignment_id" value="<?= $asg['id'] ?>">

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block font-bold text-slate-700 mb-1">
                                        <?= $asg['submission_status'] ? 'Re-upload Project File' : 'Upload Project File (.zip, .pdf, .py, etc.)' ?>
                                    </label>
                                    <input type="file" name="submission_file" required
                                           class="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#082592] file:text-white hover:file:bg-[#061A3A] file:cursor-pointer">
                                </div>

                                <div>
                                    <label class="block font-bold text-slate-700 mb-1">Student Notes / Comments (Optional)</label>
                                    <input type="text" name="comments" placeholder="e.g. Completed with extra credit features..."
                                           class="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white">
                                </div>
                            </div>

                            <button type="submit" class="py-2.5 px-6 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer">
                                <?= $asg['submission_status'] ? 'Update Project Submission' : 'Submit Project for Grading' ?> →
                            </button>
                        </form>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </main>
</body>
</html>
