<?php
// Auto-detect if installer should be run
if (!file_exists(__DIR__ . '/installed.lock') && file_exists(__DIR__ . '/install.php')) {
    header("Location: install.php");
    exit;
}

$pageTitle = 'Home';
require_once __DIR__ . '/includes/header.php';

$pdo = Database::connect();

// Fetch live statistics strictly from database
$stmtStudents = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'");
$totalStudents = (int)$stmtStudents->fetchColumn();

$stmtCourses = $pdo->query("SELECT COUNT(*) FROM courses WHERE is_active = 1");
$totalCourses = (int)$stmtCourses->fetchColumn();

$stmtEnrolments = $pdo->query("SELECT COUNT(*) FROM course_enrolments");
$totalEnrolments = (int)$stmtEnrolments->fetchColumn();

$stmtGraded = $pdo->query("SELECT COUNT(*) FROM assignment_submissions WHERE status = 'Graded'");
$totalGraded = (int)$stmtGraded->fetchColumn();

// Fetch featured courses
$stmtFeatured = $pdo->query("SELECT * FROM courses WHERE is_active = 1 ORDER BY id ASC LIMIT 6");
$courses = $stmtFeatured->fetchAll();
?>

<!-- Hero Section -->
<section class="bg-[#F2F6FF] py-16 lg:py-24 border-b border-blue-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-7 space-y-6">
                <span class="inline-block px-3 py-1 bg-blue-100 text-[#082592] text-xs font-bold rounded uppercase">
                    Best Online Education
                </span>
                <h1 class="text-3xl sm:text-5xl font-heading font-extrabold text-[#061A3A] tracking-tight leading-tight">
                    Build Your Future With <span class="text-[#082592]">DevGenius</span> <span class="text-[#1746C5]">Academy</span>
                </h1>
                <p class="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                    Gain practical digital skills, learn from experienced instructors, and develop the expertise you need to succeed in today's technology-driven world.
                </p>
                <div class="flex items-center gap-4 pt-2">
                    <a href="courses.php" class="py-3 px-6 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-md transition-all">
                        Explore Courses
                    </a>
                    <a href="register.php" class="py-3 px-6 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-md transition-all">
                        Create Free Account
                    </a>
                </div>
            </div>
            <div class="lg:col-span-5 flex justify-center">
                <div class="p-6 bg-white rounded-3xl shadow-xl border border-blue-100 w-full max-w-sm text-center space-y-4">
                    <div class="w-16 h-16 rounded-2xl bg-blue-50 text-[#082592] mx-auto flex items-center justify-center font-heading font-extrabold text-2xl">
                        DG
                    </div>
                    <h3 class="font-heading font-bold text-lg text-slate-900">Empowering Future Tech Leaders</h3>
                    <p class="text-xs text-slate-500">Structured syllabi with live MySQL database persistence & assignment grading.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Live Database Statistics Section -->
<section class="bg-gradient-to-r from-[#061A3A] via-[#082592] to-[#1746C5] py-14 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-8">
        <div>
            <h2 class="text-2xl font-heading font-extrabold text-white">Real Platform Statistics</h2>
            <p class="text-xs text-blue-200 mt-1">Directly queried from MySQL database records.</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="p-5 rounded-2xl bg-white/10 backdrop-blur-xs">
                <div class="text-3xl font-heading font-extrabold tabular-nums"><?= $totalStudents ?></div>
                <div class="text-xs font-semibold text-blue-100 mt-1">Registered Students</div>
            </div>
            <div class="p-5 rounded-2xl bg-white/10 backdrop-blur-xs">
                <div class="text-3xl font-heading font-extrabold tabular-nums"><?= $totalCourses ?></div>
                <div class="text-xs font-semibold text-blue-100 mt-1">Available Courses</div>
            </div>
            <div class="p-5 rounded-2xl bg-white/10 backdrop-blur-xs">
                <div class="text-3xl font-heading font-extrabold tabular-nums"><?= $totalEnrolments ?></div>
                <div class="text-xs font-semibold text-blue-100 mt-1">Total Enrolments</div>
            </div>
            <div class="p-5 rounded-2xl bg-white/10 backdrop-blur-xs">
                <div class="text-3xl font-heading font-extrabold tabular-nums"><?= $totalGraded ?></div>
                <div class="text-xs font-semibold text-blue-100 mt-1">Graded Submissions</div>
            </div>
        </div>
    </div>
</section>

<!-- Featured Courses Grid -->
<section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="text-center max-w-xl mx-auto mb-12">
            <span class="text-xs font-bold text-[#082592] uppercase">Featured Tracks</span>
            <h2 class="text-3xl font-heading font-extrabold text-[#061A3A] mt-1">Explore Our Featured Courses</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <?php foreach ($courses as $c): ?>
                <div class="rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all">
                    <div class="space-y-2">
                        <span class="text-[10px] font-bold text-[#082592] bg-blue-50 px-2 py-0.5 rounded">
                            <?= sanitize($c['category']) ?>
                        </span>
                        <h3 class="font-heading font-bold text-base text-slate-900"><?= sanitize($c['title']) ?></h3>
                        <p class="text-xs text-slate-600 line-clamp-2"><?= sanitize($c['description']) ?></p>
                        <div class="text-xs text-slate-500 font-medium">Duration: <?= sanitize($c['duration']) ?> · <?= sanitize($c['level']) ?></div>
                    </div>
                    <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div class="text-lg font-heading font-extrabold text-[#082592]">$<?= number_format($c['price'], 2) ?></div>
                        <a href="login.php?redirect=courses.php" class="py-1.5 px-3.5 bg-[#F28C18] text-white text-xs font-bold rounded-lg">
                            Enrol Now
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
