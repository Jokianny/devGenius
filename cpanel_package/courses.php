<?php
$pageTitle = 'Courses Catalog';
$activeNav = 'courses';
require_once __DIR__ . '/includes/header.php';

$category = trim($_GET['category'] ?? 'All');
$search = trim($_GET['q'] ?? '');
$courses = [];

try {
    $pdo = Database::connect();
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
} catch (Exception $e) {
    // Graceful handling if DB is not installed
}

$categories = ['All', 'Web Development', 'Programming', 'Design', 'Digital Marketing', 'Database Management'];
?>

<div class="py-12 bg-slate-50 flex-1">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div>
            <span class="text-xs font-bold text-[#082592] uppercase tracking-wider">Course Catalog</span>
            <h1 class="text-3xl font-heading font-extrabold text-[#061A3A] mt-1">Available Programs</h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Hands-on technical tracks designed for career acceleration.</p>
        </div>

        <!-- Search Bar -->
        <div class="flex flex-col sm:flex-row items-center gap-3">
            <form method="GET" action="courses.php" class="flex flex-1 gap-2 w-full max-w-lg">
                <input type="text" name="q" value="<?= sanitize($search) ?>" placeholder="Search by course title or keywords..."
                       class="flex-1 px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]">
                <button type="submit" class="py-2.5 px-5 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-sm">
                    Search
                </button>
            </form>
        </div>

        <!-- Category Pills -->
        <div class="flex flex-wrap gap-2">
            <?php foreach ($categories as $cat): ?>
                <a href="courses.php?category=<?= urlencode($cat) ?>" 
                   class="px-4 py-2 text-xs font-bold rounded-xl transition-all <?= $category === $cat ? 'bg-[#082592] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100' ?>">
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

                            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <span><i class="fa-regular fa-clock mr-1 text-slate-400"></i><?= sanitize($c['duration']) ?></span>
                                <span><i class="fa-solid fa-layer-group mr-1 text-slate-400"></i><?= sanitize($c['level']) ?></span>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <span class="text-[10px] text-slate-400 block font-medium">Tuition</span>
                                <div class="text-xl font-heading font-extrabold text-[#082592]">
                                    $<?= number_format($c['price'], 2) ?>
                                </div>
                            </div>

                            <a href="course-details.php?id=<?= $c['id'] ?>" class="py-2.5 px-5 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
                                <span>Details & Enrol</span>
                                <i class="fa-solid fa-arrow-right text-[10px]"></i>
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
