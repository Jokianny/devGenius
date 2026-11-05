<?php
$pageTitle = 'All Courses';
require_once __DIR__ . '/includes/header.php';

$pdo = Database::connect();
$category = trim($_GET['category'] ?? 'All');
$search = trim($_GET['q'] ?? '');

$sql = "SELECT c.*, i.name AS instructor_name FROM courses c 
        LEFT JOIN instructors i ON c.instructor_id = i.id 
        WHERE c.is_active = 1";
$params = [];

if ($category !== 'All' && !empty($category)) {
    $sql .= " AND c.category = ?";
    $params[] = $category;
}

if (!empty($search)) {
    $sql .= " AND (c.title LIKE ? OR c.description LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

$sql .= " ORDER BY c.id ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$courses = $stmt->fetchAll();

$categories = ['All', 'Web Development', 'Programming', 'Design', 'Digital Marketing', 'Database Management'];
?>

<div class="py-12 bg-slate-50 flex-1">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div>
            <span class="text-xs font-bold text-[#082592] uppercase">Curriculum Catalog</span>
            <h1 class="text-3xl font-heading font-extrabold text-[#061A3A] mt-1">Explore Available Courses</h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Practical tech training in software engineering, AI, UI/UX, and data systems.</p>
        </div>

        <!-- Filter Bar -->
        <div class="flex flex-col sm:flex-row items-center gap-3">
            <form method="GET" action="courses.php" class="flex flex-1 gap-2 w-full">
                <input type="text" name="q" value="<?= sanitize($search) ?>" placeholder="Search courses..."
                       class="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                <button type="submit" class="py-2 px-4 bg-[#082592] text-white text-xs font-bold rounded-xl">Search</button>
            </form>
        </div>

        <!-- Category Pills -->
        <div class="flex flex-wrap gap-2">
            <?php foreach ($categories as $cat): ?>
                <a href="courses.php?category=<?= urlencode($cat) ?>" 
                   class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors <?= $category === $cat ? 'bg-[#082592] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100' ?>">
                    <?= sanitize($cat) ?>
                </a>
            <?php endforeach; ?>
        </div>

        <!-- Course Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php if (empty($courses)): ?>
                <div class="col-span-3 p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    No active courses found matching your criteria.
                </div>
            <?php else: ?>
                <?php foreach ($courses as $c): ?>
                    <div class="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all">
                        <div class="space-y-2">
                            <span class="text-[10px] font-bold text-[#082592] bg-blue-50 px-2 py-0.5 rounded">
                                <?= sanitize($c['category']) ?>
                            </span>
                            <h3 class="font-heading font-bold text-base text-slate-900"><?= sanitize($c['title']) ?></h3>
                            <p class="text-xs text-slate-600 line-clamp-3"><?= sanitize($c['description']) ?></p>
                            <div class="text-xs text-slate-500 pt-1">
                                Duration: <?= sanitize($c['duration']) ?> · Level: <?= sanitize($c['level']) ?>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <span class="text-[10px] text-slate-400">Tuition</span>
                                <div class="text-lg font-heading font-extrabold text-[#082592]">$<?= number_format($c['price'], 2) ?></div>
                            </div>

                            <a href="course-details.php?id=<?= $c['id'] ?>" class="py-2 px-4 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-lg transition-all">
                                View Course
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
