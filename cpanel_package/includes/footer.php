    <!-- Footer -->
    <footer class="bg-[#061A3A] text-slate-300 pt-16 pb-12 mt-auto border-t border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
                <!-- Col 1: Brand Info -->
                <div class="lg:col-span-2 space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-[#082592] text-white flex items-center justify-center font-bold text-base shadow-sm">
                            <i class="fa-solid fa-graduation-cap text-[#F28C18]"></i>
                        </div>
                        <span class="font-heading font-extrabold text-xl text-white tracking-tight">
                            DEVGENIUS <span class="text-[#F28C18]">ACADEMY</span>
                        </span>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
                        Empowering learners worldwide with quality digital education, practical hands-on software development bootcamps, and career-advancing tech credentials.
                    </p>
                    <div class="flex items-center gap-3 pt-2">
                        <a href="#" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#F28C18] hover:text-white flex items-center justify-center text-xs transition-colors"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#F28C18] hover:text-white flex items-center justify-center text-xs transition-colors"><i class="fa-brands fa-twitter"></i></a>
                        <a href="#" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#F28C18] hover:text-white flex items-center justify-center text-xs transition-colors"><i class="fa-brands fa-linkedin-in"></i></a>
                        <a href="#" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#F28C18] hover:text-white flex items-center justify-center text-xs transition-colors"><i class="fa-brands fa-youtube"></i></a>
                    </div>
                </div>

                <!-- Col 2: Quick Links -->
                <div class="space-y-3">
                    <h4 class="font-heading font-bold text-white text-sm">Quick Links</h4>
                    <ul class="space-y-2 text-xs text-slate-400">
                        <li><a href="index.php" class="hover:text-white transition-colors">Home</a></li>
                        <li><a href="courses.php" class="hover:text-white transition-colors">Courses Catalog</a></li>
                        <li><a href="index.php#why-us" class="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="index.php#instructors" class="hover:text-white transition-colors">Our Instructors</a></li>
                        <li><a href="register.php" class="hover:text-white transition-colors">Student Registration</a></li>
                    </ul>
                </div>

                <!-- Col 3: Tracks -->
                <div class="space-y-3">
                    <h4 class="font-heading font-bold text-white text-sm">Course Tracks</h4>
                    <ul class="space-y-2 text-xs text-slate-400">
                        <li><a href="courses.php?category=Web+Development" class="hover:text-white transition-colors">Web Development</a></li>
                        <li><a href="courses.php?category=Programming" class="hover:text-white transition-colors">Python Programming</a></li>
                        <li><a href="courses.php?category=Design" class="hover:text-white transition-colors">UI/UX Design</a></li>
                        <li><a href="courses.php?category=Digital+Marketing" class="hover:text-white transition-colors">Digital Marketing</a></li>
                        <li><a href="courses.php?category=Database+Management" class="hover:text-white transition-colors">Database Management</a></li>
                    </ul>
                </div>

                <!-- Col 4: Contact & Portal -->
                <div class="space-y-3">
                    <h4 class="font-heading font-bold text-white text-sm">Contact & Portal</h4>
                    <ul class="space-y-2 text-xs text-slate-400">
                        <li class="flex items-start gap-2">
                            <i class="fa-solid fa-location-dot text-[#F28C18] mt-0.5"></i>
                            <span>123 Education Boulevard, Tech City</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fa-solid fa-envelope text-[#F28C18]"></i>
                            <span>support@devgenius.academy</span>
                        </li>
                        <li class="pt-2">
                            <a href="login.php" class="inline-block py-2 px-3.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-xs">
                                Student / Admin Login →
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <p>&copy; <?= date('Y') ?> DevGenius Academy. All rights reserved. Engineered for cPanel & DirectAdmin Shared Hosting.</p>
                <div class="flex gap-6">
                    <a href="#" class="hover:text-slate-400">Privacy Policy</a>
                    <a href="#" class="hover:text-slate-400">Terms of Service</a>
                    <a href="install.php" class="hover:text-[#F28C18]">Setup Wizard</a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
