<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/auth.php';

$currentUser = get_current_user_account();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? sanitize($pageTitle) . ' | ' . APP_NAME : APP_NAME ?></title>
    <!-- Tailwind CSS CDN for instant styling without local build step on cPanel -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4, h5, h6, .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-white text-slate-900 antialiased flex flex-col min-h-screen">
    <!-- Top Information Bar -->
    <div class="bg-[#061A3A] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-6">
                <span>contact@devgenius.academy</span>
                <span class="hidden sm:inline">+1 (800) 456-7890</span>
            </div>
            <div class="text-slate-400">cPanel Shared Hosting · PHP 8.1+ & MySQL</div>
        </div>
    </div>

    <!-- Main Navigation Bar -->
    <header class="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
            <a href="index.php" class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#082592] text-white flex items-center justify-center font-bold text-sm">
                    DG
                </div>
                <div class="font-heading font-extrabold text-lg tracking-tight text-[#061A3A]">
                    DEVGENIUS <span class="text-xs px-1.5 py-0.5 rounded bg-[#F28C18]/15 text-[#F28C18]">ACADEMY</span>
                </div>
            </a>

            <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
                <a href="index.php" class="hover:text-[#082592]">Home</a>
                <a href="courses.php" class="hover:text-[#082592]">Courses</a>
                <a href="index.php#why-choose-us" class="hover:text-[#082592]">Why Choose Us</a>
                <a href="index.php#faq" class="hover:text-[#082592]">FAQ</a>
            </nav>

            <div class="flex items-center gap-3">
                <?php if ($currentUser): ?>
                    <a href="<?= $currentUser['role'] === 'admin' ? 'admin/dashboard.php' : 'student/dashboard.php' ?>" 
                       class="py-2 px-4 bg-[#082592] text-white text-xs font-bold rounded-lg shadow-sm">
                        <?= $currentUser['role'] === 'admin' ? 'Admin Portal' : 'Student Portal' ?>
                    </a>
                    <a href="logout.php" class="text-xs font-semibold text-rose-600 hover:underline">Logout</a>
                <?php else: ?>
                    <a href="login.php" class="py-2 px-3.5 text-xs font-semibold text-[#082592] hover:bg-[#F2F6FF] rounded-lg">Sign In</a>
                    <a href="register.php" class="py-2 px-4 bg-[#F28C18] text-white text-xs font-bold rounded-lg shadow-sm">Get Started</a>
                <?php endif; ?>
            </div>
        </div>
    </header>
