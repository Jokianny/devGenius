<?php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
require_once __DIR__ . '/../includes/auth.php';

$currentUser = require_admin();
$pdo = Database::connect();
$msg = '';

// Handle Add Course
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_course'])) {
    $title = trim($_POST['title'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $duration = trim($_POST['duration'] ?? '8 Weeks');
    $level = trim($_POST['level'] ?? 'Beginner');
    $price = (float)($_POST['price'] ?? 0.00);
    $instructorId = (int)($_POST['instructor_id'] ?? 1);

    if (!empty($title) && !empty($category) && !empty($description)) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        $thumbnail = 'assets/images/courses/web_dev.jpg';

        try {
            $stmt = $pdo->prepare("INSERT INTO courses (instructor_id, title, slug, category, description, duration, level, price, thumbnail, is_active, is_featured) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)");
            $stmt->execute([$instructorId, $title, $slug . '-' . time(), $category, $description, $duration, $level, $price, $thumbnail]);
            $msg = '<div class="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl">Course added successfully to catalog!</div>';
        } catch (Exception $e) {
            $msg = '<div class="p-4 bg-rose-50 text-rose-800 text-xs rounded-xl">Error adding course: ' . htmlspecialchars($e->getMessage()) . '</div>';
        }
    }
}

// Handle Toggle Status
if (isset($_GET['toggle_status'])) {
    $courseId = (int)$_GET['toggle_status'];
    if ($courseId > 0) {
        $pdo->query("UPDATE courses SET is_active = IF(is_active=1, 0, 1) WHERE id = $courseId");
        header("Location: courses.php");
        exit;
    }
}

// Fetch Courses with Instructors
$stmtCourses = $pdo->query("SELECT c.*, i.name AS instructor_name, COUNT(ce.id) AS enrolment_count 
                             FROM courses c 
                             LEFT JOIN instructors i ON c.instructor_id = i.id 
                             LEFT JOIN course_enrolments ce ON c.id = ce.course_id 
                             GROUP BY c.id 
                             ORDER BY c.id ASC");
$courses = $stmtCourses->fetchAll();

// Fetch Instructors for dropdown
$stmtInst = $pdo->query("SELECT id, name FROM instructors ORDER BY name ASC");
$instructors = $stmtInst->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Catalog Management - DevGenius Academy</title>
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
                <a href="courses.php" class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-[#082592] text-white">
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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Curriculum Management</span>
                <h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">
                    Manage Courses
                </h1>
                <p class="text-xs text-slate-500">Add new programs, edit tuition fees, and toggle catalog status.</p>
            </div>
            <a href="#add-course-form" class="py-2.5 px-5 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-sm transition-all self-start flex items-center gap-2">
                <i class="fa-solid fa-plus"></i>
                <span>Add New Course</span>
            </a>
        </div>

        <?php if ($msg) echo $msg; ?>

        <!-- Courses Table -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 class="font-heading font-bold text-base text-slate-900">Current Course Catalog (<?= count($courses) ?> Total)</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
                        <tr>
                            <th class="p-3">ID</th>
                            <th class="p-3">Course Title</th>
                            <th class="p-3">Category</th>
                            <th class="p-3">Instructor</th>
                            <th class="p-3">Duration & Level</th>
                            <th class="p-3">Tuition</th>
                            <th class="p-3">Enrolled</th>
                            <th class="p-3">Status</th>
                            <th class="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($courses as $c): ?>
                            <tr class="hover:bg-slate-50/80">
                                <td class="p-3 font-mono font-bold text-slate-900">#<?= $c['id'] ?></td>
                                <td class="p-3 font-bold text-slate-800">
                                    <a href="../course-details.php?id=<?= $c['id'] ?>" target="_blank" class="hover:text-[#082592] hover:underline">
                                        <?= sanitize($c['title']) ?>
                                    </a>
                                </td>
                                <td class="p-3"><span class="px-2 py-0.5 rounded bg-blue-50 text-[#082592] font-semibold text-[11px]"><?= sanitize($c['category']) ?></span></td>
                                <td class="p-3 font-medium text-slate-700"><?= sanitize($c['instructor_name'] ?? 'Unassigned') ?></td>
                                <td class="p-3 text-slate-500"><?= sanitize($c['duration']) ?> · <?= sanitize($c['level']) ?></td>
                                <td class="p-3 font-heading font-bold text-[#082592]">$<?= number_format($c['price'], 2) ?></td>
                                <td class="p-3 font-bold text-slate-800"><?= $c['enrolment_count'] ?> students</td>
                                <td class="p-3">
                                    <span class="px-2 py-0.5 rounded text-[11px] font-bold <?= $c['is_active'] ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500' ?>">
                                        <?= $c['is_active'] ? 'Active' : 'Disabled' ?>
                                    </span>
                                </td>
                                <td class="p-3 text-right">
                                    <a href="courses.php?toggle_status=<?= $c['id'] ?>" class="text-[11px] font-bold <?= $c['is_active'] ? 'text-rose-600 hover:underline' : 'text-emerald-600 hover:underline' ?>">
                                        <?= $c['is_active'] ? 'Deactivate' : 'Activate' ?>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add Course Form -->
        <div id="add-course-form" class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 class="font-heading font-bold text-base text-slate-900">Create New Course</h3>
            <p class="text-xs text-slate-500">Publish a new program to the public course catalog.</p>

            <form method="POST" action="courses.php" class="space-y-4 text-xs">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Course Title</label>
                        <input type="text" name="title" required placeholder="e.g. Cloud DevOps Engineering"
                               class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]">
                    </div>

                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Category</label>
                        <select name="category" required class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]">
                            <option value="Web Development">Web Development</option>
                            <option value="Programming">Programming</option>
                            <option value="Design">Design</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Database Management">Database Management</option>
                            <option value="Data Science">Data Science</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Instructor</label>
                        <select name="instructor_id" class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]">
                            <?php foreach ($instructors as $inst): ?>
                                <option value="<?= $inst['id'] ?>"><?= sanitize($inst['name']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Duration</label>
                        <input type="text" name="duration" value="10 Weeks" required
                               class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]">
                    </div>

                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Level</label>
                        <select name="level" class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Tuition ($ USD)</label>
                        <input type="number" step="0.01" name="price" value="49.00" required
                               class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-slate-800 mb-1">Course Description & Outcomes</label>
                    <textarea name="description" rows="3" required placeholder="Describe what students will learn, project deliverables, and prerequisites..."
                              class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]"></textarea>
                </div>

                <button type="submit" name="add_course" class="py-2.5 px-6 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer">
                    Save & Publish Course →
                </button>
            </form>
        </div>
    </main>
</body>
</html>
