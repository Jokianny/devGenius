<?php
// Auto-detect if installer should be run
if (!file_exists(__DIR__ . '/installed.lock') && file_exists(__DIR__ . '/install.php')) {
    header("Location: install.php");
    exit;
}

$pageTitle = 'Home';
$activeNav = 'home';
require_once __DIR__ . '/includes/header.php';

// Safe Database Fetching
$totalStudents = 0;
$totalCourses = 0;
$totalEnrolments = 0;
$totalGraded = 0;
$courses = [];
$instructors = [];

try {
    $pdo = Database::connect();

    // 1. Total Registered Students (Strictly counts role = 'student', excludes admins!)
    $stmtStudents = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    $totalStudents = (int)$stmtStudents->fetchColumn();

    // 2. Available Courses
    $stmtCourses = $pdo->query("SELECT COUNT(*) FROM courses WHERE is_active = 1");
    $totalCourses = (int)$stmtCourses->fetchColumn();

    // 3. Total Enrolments
    $stmtEnrolments = $pdo->query("SELECT COUNT(*) FROM course_enrolments");
    $totalEnrolments = (int)$stmtEnrolments->fetchColumn();

    // 4. Graded Submissions
    $stmtGraded = $pdo->query("SELECT COUNT(*) FROM assignment_submissions WHERE status = 'Graded'");
    $totalGraded = (int)$stmtGraded->fetchColumn();

    // 5. Featured Courses with Instructor details
    $stmtFeatured = $pdo->query("SELECT c.*, i.name AS instructor_name, i.role_title AS instructor_role 
                                 FROM courses c 
                                 LEFT JOIN instructors i ON c.instructor_id = i.id 
                                 WHERE c.is_active = 1 
                                 ORDER BY c.is_featured DESC, c.id ASC 
                                 LIMIT 6");
    $courses = $stmtFeatured->fetchAll();

    // 6. Instructors
    $stmtInst = $pdo->query("SELECT * FROM instructors ORDER BY id ASC LIMIT 4");
    $instructors = $stmtInst->fetchAll();
} catch (Exception $e) {
    // If database connection is not yet configured, gracefully fall back to zero counts
}
?>

<!-- 1. Hero Section (Pale Blue Background) -->
<section class="bg-[#F2F6FF] py-16 lg:py-24 border-b border-blue-100/60 relative overflow-hidden">
    <!-- Decorative subtle blue background blur shapes -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Left Text Content -->
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100/80 border border-blue-200/60 text-[#082592] text-xs font-bold rounded-full uppercase tracking-wider">
                    <i class="fa-solid fa-sparkles text-[#F28C18]"></i>
                    <span>Best Online Tech Education</span>
                </div>

                <h1 class="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-[#061A3A] tracking-tight leading-[1.15]">
                    Build Your Future With <span class="text-[#082592]">DevGenius</span> <span class="text-[#1746C5]">Academy</span>
                </h1>

                <p class="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Gain practical digital skills, learn from experienced instructors, and develop the expertise you need to succeed in today's technology-driven world.
                </p>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                    <a href="courses.php" class="w-full sm:w-auto py-3.5 px-7 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/15 transition-all text-center flex items-center justify-center gap-2">
                        <span>Explore Courses</span>
                        <i class="fa-solid fa-arrow-right text-[11px]"></i>
                    </a>
                    <a href="register.php" class="w-full sm:w-auto py-3.5 px-7 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all text-center flex items-center justify-center gap-2">
                        <span>Create Free Account</span>
                        <i class="fa-solid fa-user-plus text-[11px]"></i>
                    </a>
                </div>

                <!-- Trust Indicators -->
                <div class="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                    <span class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-check text-emerald-500"></i>
                        <span>Apache Shared Hosting Ready</span>
                    </span>
                    <span class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-check text-emerald-500"></i>
                        <span>PHP 8.1+ & MySQL PDO</span>
                    </span>
                    <span class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-check text-emerald-500"></i>
                        <span>Zero Node.js Required</span>
                    </span>
                </div>
            </div>

            <!-- Right Visual & Floating Cards -->
            <div class="lg:col-span-5 flex justify-center relative">
                <div class="relative w-full max-w-md">
                    <!-- Main Student Feature Card -->
                    <div class="p-6 bg-white rounded-3xl shadow-2xl border border-slate-100 space-y-5 text-center relative overflow-hidden">
                        <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#082592] to-[#1746C5] text-white mx-auto flex items-center justify-center text-3xl shadow-lg shadow-blue-900/20">
                            <i class="fa-solid fa-user-graduate"></i>
                        </div>
                        <div class="space-y-1.5">
                            <h3 class="font-heading font-extrabold text-xl text-[#061A3A]">Empowering Future Tech Leaders</h3>
                            <p class="text-xs text-slate-500 leading-relaxed">
                                Join our thriving digital community. Learn full-stack web engineering, Python algorithms, and UI/UX design.
                            </p>
                        </div>
                        <div class="p-4 bg-[#F2F6FF] rounded-2xl border border-blue-100/60 text-left space-y-2">
                            <div class="flex items-center justify-between text-xs font-bold text-[#082592]">
                                <span>Active Student Registrations</span>
                                <span class="tabular-nums font-extrabold text-sm"><?= $totalStudents ?></span>
                            </div>
                            <div class="w-full bg-blue-200/50 rounded-full h-2 overflow-hidden">
                                <div class="bg-[#082592] h-2 rounded-full w-4/5"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Floating Badge 1 (Top Right) -->
                    <div class="absolute -top-4 -right-4 bg-white py-2.5 px-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-slate-900">95% Success Rate</div>
                            <div class="text-[10px] text-slate-400">Career Advancement</div>
                        </div>
                    </div>

                    <!-- Floating Badge 2 (Bottom Left) -->
                    <div class="absolute -bottom-4 -left-4 bg-white py-2.5 px-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-[#F28C18]/15 text-[#F28C18] flex items-center justify-center text-sm font-bold">
                            <i class="fa-solid fa-award"></i>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-slate-900">Certified Curriculum</div>
                            <div class="text-[10px] text-slate-400">Industry-Aligned</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 2. Featured Courses Section -->
<section class="py-20 bg-white" id="featured-courses">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Top Programs</span>
                <h2 class="text-3xl sm:text-4xl font-heading font-extrabold text-[#061A3A] mt-1">
                    Explore Our Featured Courses
                </h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl">
                    Discover practical courses designed to help you gain in-demand technology skills and build real-world portfolio projects.
                </p>
            </div>
            <a href="courses.php" class="inline-flex items-center gap-2 text-xs font-bold text-[#082592] hover:text-[#061A3A]">
                <span>View All Courses</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </a>
        </div>

        <!-- Course Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php if (empty($courses)): ?>
                <div class="col-span-3 p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
                    <p class="font-bold text-sm text-slate-700">No courses loaded yet.</p>
                    <p>Run the <a href="install.php" class="text-[#082592] underline font-bold">Automatic Database Installer</a> to populate the course catalog.</p>
                </div>
            <?php else: ?>
                <?php foreach ($courses as $c): ?>
                    <div class="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 hover:shadow-xl hover:border-blue-200 transition-all group">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-bold text-[#082592] bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                                    <?= sanitize($c['category']) ?>
                                </span>
                                <span class="text-xs text-amber-500 font-bold flex items-center gap-1">
                                    <i class="fa-solid fa-star text-[10px]"></i>
                                    <span><?= number_format($c['rating'] ?? 4.8, 1) ?></span>
                                </span>
                            </div>

                            <h3 class="font-heading font-bold text-lg text-slate-900 group-hover:text-[#082592] transition-colors leading-snug">
                                <?= sanitize($c['title']) ?>
                            </h3>

                            <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                <?= sanitize($c['description']) ?>
                            </p>

                            <!-- Course Metadata -->
                            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <span class="flex items-center gap-1.5">
                                    <i class="fa-regular fa-clock text-slate-400"></i>
                                    <span><?= sanitize($c['duration']) ?></span>
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <i class="fa-solid fa-layer-group text-slate-400"></i>
                                    <span><?= sanitize($c['level']) ?></span>
                                </span>
                            </div>
                        </div>

                        <!-- Price & Enrol Button -->
                        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <span class="text-[10px] text-slate-400 block font-medium">Tuition</span>
                                <div class="text-xl font-heading font-extrabold text-[#082592]">
                                    $<?= number_format($c['price'], 2) ?>
                                </div>
                            </div>

                            <a href="course-details.php?id=<?= $c['id'] ?>" class="py-2.5 px-5 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
                                <span>Enrol Now</span>
                                <i class="fa-solid fa-arrow-right text-[10px]"></i>
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- 3. Course Categories -->
<section class="py-16 bg-[#F2F6FF] border-y border-blue-100/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div class="text-center max-w-xl mx-auto space-y-2">
            <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Diverse Tracks</span>
            <h2 class="text-3xl font-heading font-extrabold text-[#061A3A]">Course Categories</h2>
            <p class="text-xs text-slate-500">Choose from industry-demanded specializations crafted for high-growth tech careers.</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <?php
            $catCards = [
                ['name' => 'Web Development', 'icon' => 'fa-code', 'color' => 'bg-blue-50 text-blue-700'],
                ['name' => 'Programming', 'icon' => 'fa-terminal', 'color' => 'bg-emerald-50 text-emerald-700'],
                ['name' => 'Design & UI/UX', 'icon' => 'fa-palette', 'color' => 'bg-purple-50 text-purple-700'],
                ['name' => 'Digital Marketing', 'icon' => 'fa-bullhorn', 'color' => 'bg-amber-50 text-amber-700'],
                ['name' => 'Data Science', 'icon' => 'fa-chart-pie', 'color' => 'bg-indigo-50 text-indigo-700'],
                ['name' => 'Database SQL', 'icon' => 'fa-database', 'color' => 'bg-rose-50 text-rose-700'],
            ];
            foreach ($catCards as $cat):
            ?>
                <a href="courses.php?category=<?= urlencode($cat['name']) ?>" class="p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#082592] hover:shadow-md transition-all text-center space-y-3 group">
                    <div class="w-12 h-12 rounded-xl <?= $cat['color'] ?> mx-auto flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <i class="fa-solid <?= $cat['icon'] ?>"></i>
                    </div>
                    <div class="font-heading font-bold text-xs text-slate-900 group-hover:text-[#082592]"><?= $cat['name'] ?></div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- 4. Why Choose DevGenius Academy -->
<section class="py-20 bg-white" id="why-us">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div class="text-center max-w-xl mx-auto space-y-2">
            <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Our Core Strengths</span>
            <h2 class="text-3xl font-heading font-extrabold text-[#061A3A]">Why Choose DevGenius Academy?</h2>
            <p class="text-xs text-slate-500">We blend rigorous curriculum with practical application to ensure student mastery.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="w-10 h-10 rounded-xl bg-blue-100 text-[#082592] flex items-center justify-center text-lg font-bold">
                    <i class="fa-solid fa-chalkboard-user"></i>
                </div>
                <h3 class="font-heading font-bold text-base text-slate-900">Expert Instructors</h3>
                <p class="text-xs text-slate-600 leading-relaxed">Learn directly from seasoned engineers and senior tech leaders with extensive real-world expertise.</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold">
                    <i class="fa-solid fa-laptop-code"></i>
                </div>
                <h3 class="font-heading font-bold text-base text-slate-900">Practical Learning</h3>
                <p class="text-xs text-slate-600 leading-relaxed">Every course includes hands-on assignment submissions graded with actionable feedback from teachers.</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold">
                    <i class="fa-solid fa-calendar-check"></i>
                </div>
                <h3 class="font-heading font-bold text-base text-slate-900">Flexible Scheduling</h3>
                <p class="text-xs text-slate-600 leading-relaxed">Study anywhere, anytime at your own speed with lifetime access to enrolled materials and lectures.</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold">
                    <i class="fa-solid fa-certificate"></i>
                </div>
                <h3 class="font-heading font-bold text-base text-slate-900">Quality Education</h3>
                <p class="text-xs text-slate-600 leading-relaxed">Comprehensive curriculum structured in accordance with global software engineering standards.</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg font-bold">
                    <i class="fa-solid fa-briefcase"></i>
                </div>
                <h3 class="font-heading font-bold text-base text-slate-900">Career Development</h3>
                <p class="text-xs text-slate-600 leading-relaxed">Portfolio-building projects, resume optimization guidelines, and interview preparation workshops.</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
                    <i class="fa-solid fa-headset"></i>
                </div>
                <h3 class="font-heading font-bold text-base text-slate-900">Student Support</h3>
                <p class="text-xs text-slate-600 leading-relaxed">Dedicated administrative and instructor assistance throughout your entire learning journey.</p>
            </div>
        </div>
    </div>
</section>

<!-- 5. Platform Statistics Banner (Deep Blue Banner) -->
<section class="bg-gradient-to-r from-[#061A3A] via-[#082592] to-[#1746C5] py-16 text-white relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-10">
        <div class="space-y-2">
            <span class="text-xs font-bold text-[#F28C18] uppercase tracking-wider">Live Platform Metrics</span>
            <h2 class="text-3xl sm:text-4xl font-heading font-extrabold text-white">Platform Statistics</h2>
            <p class="text-xs sm:text-sm text-blue-200 max-w-lg mx-auto">
                Real database counts calculated live from our MySQL database records.
            </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div class="text-4xl font-heading font-extrabold tabular-nums"><?= $totalStudents ?></div>
                <div class="text-xs font-bold text-blue-200 uppercase tracking-wide mt-2">Registered Students</div>
                <div class="text-[10px] text-blue-300/80 mt-0.5">Excludes administrators</div>
            </div>

            <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div class="text-4xl font-heading font-extrabold tabular-nums"><?= $totalCourses ?></div>
                <div class="text-xs font-bold text-blue-200 uppercase tracking-wide mt-2">Available Courses</div>
                <div class="text-[10px] text-blue-300/80 mt-0.5">Active tech curricula</div>
            </div>

            <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div class="text-4xl font-heading font-extrabold tabular-nums"><?= $totalEnrolments ?></div>
                <div class="text-xs font-bold text-blue-200 uppercase tracking-wide mt-2">Total Enrolments</div>
                <div class="text-[10px] text-blue-300/80 mt-0.5">Course admissions</div>
            </div>

            <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div class="text-4xl font-heading font-extrabold tabular-nums"><?= $totalGraded ?></div>
                <div class="text-xs font-bold text-blue-200 uppercase tracking-wide mt-2">Graded Submissions</div>
                <div class="text-[10px] text-blue-300/80 mt-0.5">Evaluated projects</div>
            </div>
        </div>
    </div>
</section>

<!-- 6. How It Works (4 Simple Steps) -->
<section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div class="text-center max-w-xl mx-auto space-y-2">
            <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Fast & Simple</span>
            <h2 class="text-3xl font-heading font-extrabold text-[#061A3A]">How It Works</h2>
            <p class="text-xs text-slate-500">Four straightforward steps to accelerate your digital technology career.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="p-6 rounded-2xl border border-slate-200 text-center space-y-3 relative">
                <div class="w-10 h-10 rounded-full bg-[#082592] text-white flex items-center justify-center font-bold text-sm mx-auto">1</div>
                <h3 class="font-heading font-bold text-sm text-slate-900">Create Free Account</h3>
                <p class="text-xs text-slate-500">Register in under a minute with your name and email to access the student portal.</p>
            </div>

            <div class="p-6 rounded-2xl border border-slate-200 text-center space-y-3 relative">
                <div class="w-10 h-10 rounded-full bg-[#082592] text-white flex items-center justify-center font-bold text-sm mx-auto">2</div>
                <h3 class="font-heading font-bold text-sm text-slate-900">Select Your Track</h3>
                <p class="text-xs text-slate-500">Explore web development, Python, UI/UX, or marketing and enrol instantly.</p>
            </div>

            <div class="p-6 rounded-2xl border border-slate-200 text-center space-y-3 relative">
                <div class="w-10 h-10 rounded-full bg-[#082592] text-white flex items-center justify-center font-bold text-sm mx-auto">3</div>
                <h3 class="font-heading font-bold text-sm text-slate-900">Submit Assignments</h3>
                <p class="text-xs text-slate-500">Build real projects and upload your files to receive verified grades and feedback.</p>
            </div>

            <div class="p-6 rounded-2xl border border-slate-200 text-center space-y-3 relative">
                <div class="w-10 h-10 rounded-full bg-[#F28C18] text-white flex items-center justify-center font-bold text-sm mx-auto">4</div>
                <h3 class="font-heading font-bold text-sm text-slate-900">Earn Certificate</h3>
                <p class="text-xs text-slate-500">Graduate with distinction, showcase your portfolio, and step into high-paying roles.</p>
            </div>
        </div>
    </div>
</section>

<!-- 7. Meet Our Top Teachers -->
<?php if (!empty($instructors)): ?>
<section class="py-20 bg-[#F2F6FF]" id="instructors">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div class="text-center max-w-xl mx-auto space-y-2">
            <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">World-Class Mentors</span>
            <h2 class="text-3xl font-heading font-extrabold text-[#061A3A]">Meet Our Top Teachers</h2>
            <p class="text-xs text-slate-500">Industry veterans passionate about nurturing the next generation of engineers.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <?php foreach ($instructors as $inst): ?>
                <div class="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-4 hover:shadow-lg transition-all">
                    <div class="w-20 h-20 rounded-2xl bg-blue-100 text-[#082592] mx-auto flex items-center justify-center text-3xl font-bold">
                        <i class="fa-solid fa-user-tie"></i>
                    </div>
                    <div class="space-y-1">
                        <h3 class="font-heading font-bold text-base text-slate-900"><?= sanitize($inst['name']) ?></h3>
                        <p class="text-xs font-semibold text-[#082592]"><?= sanitize($inst['role_title']) ?></p>
                        <p class="text-[11px] text-slate-500 line-clamp-2"><?= sanitize($inst['bio']) ?></p>
                    </div>
                    <div class="pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-xs text-amber-500 font-bold">
                        <i class="fa-solid fa-star text-[10px]"></i>
                        <span><?= number_format($inst['rating'] ?? 4.9, 1) ?> Rating</span>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- 8. FAQ Accordion -->
<section class="py-20 bg-white" id="faq">
    <div class="max-w-3xl mx-auto px-4 sm:px-8 space-y-10">
        <div class="text-center space-y-2">
            <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Got Questions?</span>
            <h2 class="text-3xl font-heading font-extrabold text-[#061A3A]">Frequently Asked Questions</h2>
        </div>

        <div class="space-y-4 text-xs">
            <details class="p-5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer group" open>
                <summary class="font-heading font-bold text-sm text-slate-900 flex items-center justify-between">
                    <span>How does student registration and course enrolment work?</span>
                    <i class="fa-solid fa-chevron-down text-slate-400 group-open:rotate-180 transition-transform"></i>
                </summary>
                <p class="mt-3 text-slate-600 leading-relaxed">
                    Click "Create Free Account" to register with your email. Once logged in to your Student Portal, you can explore the catalog and enrol in any track with a single click.
                </p>
            </details>

            <details class="p-5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer group">
                <summary class="font-heading font-bold text-sm text-slate-900 flex items-center justify-between">
                    <span>Does this website run on cPanel or DirectAdmin shared hosting?</span>
                    <i class="fa-solid fa-chevron-down text-slate-400 group-open:rotate-180 transition-transform"></i>
                </summary>
                <p class="mt-3 text-slate-600 leading-relaxed">
                    Yes! DevGenius Academy is built with pure PHP 8.1+ and MySQL PDO. It runs out of the box on standard Apache shared hosting servers without requiring Node.js or Docker.
                </p>
            </details>

            <details class="p-5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer group">
                <summary class="font-heading font-bold text-sm text-slate-900 flex items-center justify-between">
                    <span>How are student assignment submissions graded?</span>
                    <i class="fa-solid fa-chevron-down text-slate-400 group-open:rotate-180 transition-transform"></i>
                </summary>
                <p class="mt-3 text-slate-600 leading-relaxed">
                    Students upload project files (.zip, .pdf, .py, etc.) in their dashboard. Administrators evaluate the projects in the Admin Console, assigning marks, grades, and comprehensive constructive feedback.
                </p>
            </details>
        </div>
    </div>
</section>

<!-- 9. Newsletter Section -->
<section class="bg-[#082592] py-14 text-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6">
        <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Stay Updated With DevGenius Academy
        </h2>
        <p class="text-xs text-blue-100 max-w-lg mx-auto">
            Subscribe to our newsletter for exclusive tech masterclass announcements, scholarships, and tutorial updates.
        </p>
        <form class="max-w-md mx-auto flex flex-col sm:flex-row gap-2" onsubmit="event.preventDefault(); alert('Thank you for subscribing to DevGenius Academy!');">
            <input type="email" required placeholder="Enter your email address" 
                   class="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 text-xs focus:outline-hidden">
            <button type="submit" class="py-3 px-6 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-md transition-all">
                Subscribe
            </button>
        </form>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
