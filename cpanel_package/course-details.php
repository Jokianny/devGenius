<?php
$pageTitle = 'Course Details';
$activeNav = 'courses';
require_once __DIR__ . '/includes/header.php';

$id = (int)($_GET['id'] ?? 0);
$course = null;
$instructor = null;
$enrolled = false;
$msg = '';

if ($id > 0) {
    try {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT c.*, i.name AS instructor_name, i.role_title AS instructor_role, i.bio AS instructor_bio 
                               FROM courses c 
                               LEFT JOIN instructors i ON c.instructor_id = i.id 
                               WHERE c.id = ?");
        $stmt->execute([$id]);
        $course = $stmt->fetch();

        if ($course && $currentUser && $currentUser['role'] === 'student') {
            $stmtCheck = $pdo->prepare("SELECT id FROM course_enrolments WHERE user_id = ? AND course_id = ?");
            $stmtCheck->execute([$currentUser['id'], $course['id']]);
            $enrolled = (bool)$stmtCheck->fetch();
        }

        // Handle Enrolment POST
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['enrol_now'])) {
            if (!$currentUser) {
                header("Location: login.php?redirect=" . urlencode("course-details.php?id=$id"));
                exit;
            }
            if ($currentUser['role'] !== 'student') {
                $msg = '<div class="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">Administrators manage courses via the Admin Console.</div>';
            } elseif (!$enrolled) {
                $stmtEnrol = $pdo->prepare("INSERT INTO course_enrolments (user_id, course_id, progress_percent, status) VALUES (?, ?, 0, 'active')");
                $stmtEnrol->execute([$currentUser['id'], $course['id']]);
                $enrolled = true;
                $msg = '<div class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">Successfully enrolled! Access your assignments and curriculum in the Student Portal.</div>';
            }
        }
    } catch (Exception $e) {
        // Handle gracefully
    }
}

if (!$course):
?>
<div class="py-20 text-center space-y-4">
    <h2 class="text-2xl font-heading font-extrabold text-[#061A3A]">Course Not Found</h2>
    <p class="text-xs text-slate-500">The requested course does not exist or has been archived.</p>
    <a href="courses.php" class="inline-block py-2.5 px-5 bg-[#082592] text-white text-xs font-bold rounded-xl">Back to Courses</a>
</div>
<?php else: ?>

<div class="py-12 bg-slate-50 flex-1">
    <div class="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <?php if ($msg) echo $msg; ?>

        <!-- Course Header Card -->
        <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <span class="text-xs font-bold text-[#082592] bg-blue-50 px-3 py-1 rounded-lg uppercase">
                    <?= sanitize($course['category']) ?>
                </span>
                <span class="text-xs text-amber-500 font-bold flex items-center gap-1">
                    <i class="fa-solid fa-star text-[11px]"></i>
                    <span><?= number_format($course['rating'] ?? 4.8, 1) ?> (120+ reviews)</span>
                </span>
            </div>

            <div class="space-y-3">
                <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-[#061A3A]">
                    <?= sanitize($course['title']) ?>
                </h1>
                <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
                    <?= sanitize($course['description']) ?>
                </p>
            </div>

            <!-- Metadata Row -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F2F6FF] rounded-2xl border border-blue-100 text-xs">
                <div>
                    <span class="text-slate-400 block">Duration</span>
                    <strong class="text-slate-900"><?= sanitize($course['duration']) ?></strong>
                </div>
                <div>
                    <span class="text-slate-400 block">Skill Level</span>
                    <strong class="text-slate-900"><?= sanitize($course['level']) ?></strong>
                </div>
                <div>
                    <span class="text-slate-400 block">Tuition</span>
                    <strong class="text-[#082592] font-heading text-base font-extrabold">$<?= number_format($course['price'], 2) ?></strong>
                </div>
                <div>
                    <span class="text-slate-400 block">Instructor</span>
                    <strong class="text-slate-900"><?= sanitize($course['instructor_name'] ?? 'Faculty Lead') ?></strong>
                </div>
            </div>

            <!-- Action -->
            <div class="pt-2 flex flex-wrap items-center gap-4">
                <?php if ($enrolled): ?>
                    <a href="student/dashboard.php" class="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>Enrolled — Go to Student Dashboard</span>
                    </a>
                <?php else: ?>
                    <form method="POST" action="course-details.php?id=<?= $course['id'] ?>">
                        <button type="submit" name="enrol_now" class="py-3.5 px-8 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer">
                            <span>Enrol In This Course</span>
                            <i class="fa-solid fa-arrow-right text-[10px]"></i>
                        </button>
                    </form>
                <?php endif; ?>
                <a href="courses.php" class="py-3 px-5 text-xs font-semibold text-slate-600 hover:text-slate-900">
                    ← Back to all courses
                </a>
            </div>
        </div>

        <!-- Instructor Profile Card -->
        <?php if (!empty($course['instructor_name'])): ?>
            <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
                <h3 class="font-heading font-bold text-lg text-slate-900">About the Instructor</h3>
                <div class="flex items-start gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-blue-100 text-[#082592] flex items-center justify-center text-2xl font-bold shrink-0">
                        <i class="fa-solid fa-user-tie"></i>
                    </div>
                    <div class="space-y-1">
                        <h4 class="font-heading font-bold text-base text-slate-900"><?= sanitize($course['instructor_name']) ?></h4>
                        <p class="text-xs font-semibold text-[#082592]"><?= sanitize($course['instructor_role']) ?></p>
                        <p class="text-xs text-slate-600 leading-relaxed pt-1"><?= sanitize($course['instructor_bio']) ?></p>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php endif; ?>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
