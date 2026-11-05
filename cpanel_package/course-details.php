<?php
require_once __DIR__ . '/includes/header.php';

$pdo = Database::connect();
$courseId = (int)($_GET['id'] ?? 0);

$stmt = $pdo->prepare("SELECT c.*, i.name AS instructor_name, i.bio AS instructor_bio, i.specialization 
                       FROM courses c 
                       LEFT JOIN instructors i ON c.instructor_id = i.id 
                       WHERE c.id = ?");
$stmt->execute([$courseId]);
$course = $stmt->fetch();

if (!$course) {
    header("Location: courses.php");
    exit;
}

$pageTitle = $course['title'];

// Check if user is logged in and enrolled
$isEnrolled = false;
$enrolMessage = '';

if ($currentUser) {
    $stmtEnr = $pdo->prepare("SELECT id FROM course_enrolments WHERE user_id = ? AND course_id = ?");
    $stmtEnr->execute([$currentUser['id'], $courseId]);
    $isEnrolled = (bool)$stmtEnr->fetch();

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['enrol_action'])) {
        if ($isEnrolled) {
            $enrolMessage = "You are already enrolled in this course.";
        } else {
            $stmtInsert = $pdo->prepare("INSERT INTO course_enrolments (user_id, course_id, progress_percent, status) VALUES (?, ?, 0, 'active')");
            $stmtInsert->execute([$currentUser['id'], $courseId]);
            $isEnrolled = true;
            header("Location: student/dashboard.php?enrolled=1");
            exit;
        }
    }
}
?>

<div class="py-12 bg-slate-50 flex-1">
    <div class="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        <a href="courses.php" class="text-xs font-semibold text-[#082592] hover:underline">← Back to Course Catalog</a>

        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div class="bg-[#061A3A] text-white p-8 space-y-4">
                <span class="text-xs font-bold bg-[#F28C18] text-white px-2.5 py-0.5 rounded">
                    <?= sanitize($course['category']) ?>
                </span>
                <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                    <?= sanitize($course['title']) ?>
                </h1>
                <div class="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span>Duration: <?= sanitize($course['duration']) ?></span>
                    <span>·</span>
                    <span>Level: <?= sanitize($course['level']) ?></span>
                    <span>·</span>
                    <span>Instructor: <?= sanitize($course['instructor_name'] ?? 'Faculty Mentor') ?></span>
                </div>
            </div>

            <div class="p-8 space-y-6">
                <?php if ($enrolMessage): ?>
                    <div class="p-3 bg-blue-50 text-[#082592] text-xs font-semibold rounded-lg">
                        <?= sanitize($enrolMessage) ?>
                    </div>
                <?php endif; ?>

                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900 mb-2">Curriculum Description</h3>
                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <?= nl2br(sanitize($course['description'])) ?>
                    </p>
                </div>

                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <div class="text-xs text-slate-400">Tuition</div>
                        <div class="text-2xl font-heading font-extrabold text-[#082592]">
                            $<?= number_format($course['price'], 2) ?>
                        </div>
                    </div>

                    <?php if ($isEnrolled): ?>
                        <a href="student/dashboard.php" class="py-2.5 px-6 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs">
                            Already Enrolled · Open Portal
                        </a>
                    <?php elseif ($currentUser): ?>
                        <form method="POST" action="course-details.php?id=<?= $courseId ?>">
                            <button type="submit" name="enrol_action" value="1" 
                                    class="py-2.5 px-6 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer">
                                Enrol Now
                            </button>
                        </form>
                    <?php else: ?>
                        <a href="login.php?redirect=course-details.php?id=<?= $courseId ?>" 
                           class="py-2.5 px-6 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-xs transition-all">
                            Sign In to Enrol
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
