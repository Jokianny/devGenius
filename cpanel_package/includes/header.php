<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/auth.php';

$currentUser = get_current_user_account();
$activeNav = $activeNav ?? 'home';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? sanitize($pageTitle) . ' | ' . APP_NAME : APP_NAME . ' – Professional E-Learning & Student Portal' ?></title>
    <meta name="description" content="DevGenius Academy offers modern technology education, certified courses, hands-on programming bootcamps, and a student registration portal.">
    <!-- Tailwind CSS CDN for instant styling without local build step on cPanel -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4, h5, h6, .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-white text-slate-900 antialiased flex flex-col min-h-screen">
    <!-- Top Information Bar -->
    <div class="bg-[#061A3A] text-slate-300 text-xs py-2.5 px-4 sm:px-8 border-b border-white/10">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div class="flex items-center gap-6">
                <a href="mailto:info@devgenius.academy" class="hover:text-white flex items-center gap-2">
                    <i class="fa-solid fa-envelope text-[#F28C18]"></i>
                    <span>info@devgenius.academy</span>
                </a>
                <a href="tel:+12345678900" class="hover:text-white flex items-center gap-2">
                    <i class="fa-solid fa-phone text-[#F28C18]"></i>
                    <span>+1 (234) 567-8900</span>
                </a>
            </div>
            <div class="flex items-center gap-4 text-slate-400">
                <span class="text-[11px] hidden md:inline">Follow Us:</span>
                <a href="#" class="hover:text-[#F28C18]"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#" class="hover:text-[#F28C18]"><i class="fa-brands fa-twitter"></i></a>
                <a href="#" class="hover:text-[#F28C18]"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" class="hover:text-[#F28C18]"><i class="fa-brands fa-instagram"></i></a>
            </div>
        </div>
    </div>

    <!-- Main Navigation Bar -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
            <!-- Brand Logo -->
            <a href="index.php" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#082592] to-[#1746C5] text-white flex items-center justify-center font-bold text-base shadow-md shadow-blue-900/10">
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <div>
                    <div class="font-heading font-extrabold text-lg tracking-tight text-[#061A3A] leading-tight">
                        DEVGENIUS <span class="text-xs px-2 py-0.5 rounded bg-[#F28C18]/15 text-[#F28C18] font-bold">ACADEMY</span>
                    </div>
                    <div class="text-[10px] text-slate-400 font-medium">E-Learning & Tech Portal</div>
                </div>
            </a>

            <!-- Desktop Nav Menu -->
            <nav class="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
                <a href="index.php" class="<?= $activeNav === 'home' ? 'text-[#082592] font-bold' : 'hover:text-[#082592]' ?> transition-colors">Home</a>
                <a href="courses.php" class="<?= $activeNav === 'courses' ? 'text-[#082592] font-bold' : 'hover:text-[#082592]' ?> transition-colors">Courses</a>
                <a href="index.php#why-us" class="hover:text-[#082592] transition-colors">Why DevGenius</a>
                <a href="index.php#instructors" class="hover:text-[#082592] transition-colors">Our Instructors</a>
                <a href="index.php#faq" class="hover:text-[#082592] transition-colors">FAQ</a>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-3">
                <?php if ($currentUser): ?>
                    <a href="<?= $currentUser['role'] === 'admin' ? 'admin/dashboard.php' : 'student/dashboard.php' ?>" 
                       class="py-2.5 px-4 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
                        <i class="fa-solid fa-user-circle"></i>
                        <span><?= $currentUser['role'] === 'admin' ? 'Admin Portal' : 'Student Portal' ?></span>
                    </a>
                    <a href="logout.php" class="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2">Logout</a>
                <?php else: ?>
                    <a href="login.php" class="py-2 px-3.5 text-xs font-bold text-[#082592] hover:bg-[#F2F6FF] rounded-xl transition-colors">
                        Sign In
                    </a>
                    <a href="register.php" class="py-2.5 px-5 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2">
                        <span>Get Started</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </header>
