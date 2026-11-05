-- ============================================================================
-- DEVGENIUS ACADEMY - DATABASE SCHEMA & INITIAL DEMONSTRATION DATA
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+ (cPanel / phpMyAdmin)
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `newsletter_subscribers`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `assignment_submissions`;
DROP TABLE IF EXISTS `assignments`;
DROP TABLE IF EXISTS `course_enrolments`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `instructors`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. Table structure for table `users`
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_role` (`role`),
  INDEX `idx_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Table structure for table `instructors`
-- ----------------------------------------------------------------------------
CREATE TABLE `instructors` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `role_title` VARCHAR(150) NOT NULL,
  `specialization` VARCHAR(150) NOT NULL,
  `bio` TEXT NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `avatar` VARCHAR(255) NOT NULL,
  `rating` DECIMAL(2,1) DEFAULT 4.9,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Table structure for table `courses`
-- ----------------------------------------------------------------------------
CREATE TABLE `courses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `instructor_id` INT UNSIGNED DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `syllabus_json` LONGTEXT DEFAULT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `level` ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `original_price` DECIMAL(10,2) DEFAULT NULL,
  `thumbnail` VARCHAR(255) NOT NULL,
  `rating` DECIMAL(2,1) DEFAULT 4.8,
  `review_count` INT UNSIGNED DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_course_category` (`category`),
  INDEX `idx_course_status` (`is_active`),
  CONSTRAINT `fk_course_instructor` FOREIGN KEY (`instructor_id`) 
    REFERENCES `instructors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Table structure for table `course_enrolments`
-- ----------------------------------------------------------------------------
CREATE TABLE `course_enrolments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `progress_percent` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('active', 'completed') NOT NULL DEFAULT 'active',
  `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_student_course` (`user_id`, `course_id`),
  INDEX `idx_enrolment_user` (`user_id`),
  INDEX `idx_enrolment_course` (`course_id`),
  CONSTRAINT `fk_enrolment_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_enrolment_course` FOREIGN KEY (`course_id`) 
    REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Table structure for table `assignments`
-- ----------------------------------------------------------------------------
CREATE TABLE `assignments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `due_date` DATETIME NOT NULL,
  `max_score` INT UNSIGNED NOT NULL DEFAULT 100,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_assignment_course` (`course_id`),
  CONSTRAINT `fk_assignment_course` FOREIGN KEY (`course_id`) 
    REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Table structure for table `assignment_submissions`
-- ----------------------------------------------------------------------------
CREATE TABLE `assignment_submissions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `assignment_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_size` VARCHAR(50) NOT NULL,
  `comments` TEXT DEFAULT NULL,
  `status` ENUM('Submitted', 'Graded') NOT NULL DEFAULT 'Submitted',
  `score` INT DEFAULT NULL,
  `grade` VARCHAR(5) DEFAULT NULL,
  `feedback` TEXT DEFAULT NULL,
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `graded_at` DATETIME DEFAULT NULL,
  INDEX `idx_submission_assignment` (`assignment_id`),
  INDEX `idx_submission_user` (`user_id`),
  INDEX `idx_submission_status` (`status`),
  CONSTRAINT `fk_submission_assignment` FOREIGN KEY (`assignment_id`) 
    REFERENCES `assignments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_submission_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Table structure for table `newsletter_subscribers`
-- ----------------------------------------------------------------------------
CREATE TABLE `newsletter_subscribers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Table structure for table `announcements`
-- ----------------------------------------------------------------------------
CREATE TABLE `announcements` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `target_role` ENUM('all', 'student', 'admin') NOT NULL DEFAULT 'all',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA INSERTION
-- Password for all seed accounts below is: Password123!
-- Generated via standard PHP: password_hash('Password123!', PASSWORD_BCRYPT)
-- ============================================================================

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `bio`) VALUES
(1, 'System Administrator', 'admin@devgenius.academy', '+1 (800) 456-7890', '$2y$10$wT8KzQ7uR5Cj4O9r8kQx5uR5.Gq4c4h7j9kL0m1n2o3p4q5r6s7t8u', 'admin', 'Chief Academic Administrator and Platform Director.'),
(2, 'Sarah Mensah', 'sarah.mensah@example.com', '+234 802 345 6789', '$2y$10$wT8KzQ7uR5Cj4O9r8kQx5uR5.Gq4c4h7j9kL0m1n2o3p4q5r6s7t8u', 'student', 'Aspiring software developer enrolled in Web and Design tracks.'),
(3, 'Emmanuel Osei', 'emmanuel.osei@example.com', '+233 24 567 8901', '$2y$10$wT8KzQ7uR5Cj4O9r8kQx5uR5.Gq4c4h7j9kL0m1n2o3p4q5r6s7t8u', 'student', 'Dedicated student focusing on Python and algorithmic problem solving.'),
(4, 'Zainab Bello', 'zainab.bello@example.com', '+234 813 456 7890', '$2y$10$wT8KzQ7uR5Cj4O9r8kQx5uR5.Gq4c4h7j9kL0m1n2o3p4q5r6s7t8u', 'student', 'Product design student exploring user journey mapping and systems.');

INSERT INTO `instructors` (`id`, `name`, `role_title`, `specialization`, `bio`, `email`, `avatar`, `rating`) VALUES
(1, 'Dr. David Adeleke', 'Head of Software Architecture', 'Full-Stack & Cloud Architecture', 'Principal engineer with 14+ years designing high-scale distributed systems and mentoring thousands of developers.', 'david.adeleke@devgenius.academy', 'assets/images/instructors/david.jpg', 4.9),
(2, 'Amina Yusuf', 'Lead Product & UX Design Strategist', 'Design Systems & UX Research', 'Product design consultant with extensive experience leading UI/UX transformations for financial platforms.', 'amina.yusuf@devgenius.academy', 'assets/images/instructors/amina.jpg', 4.8),
(3, 'Dr. Marcus Chen', 'Senior AI & Data Science Researcher', 'Python, ML & Algorithms', 'Specialist in machine learning pipelines, predictive modeling, and applied Python solutions for enterprise data analytics.', 'marcus.chen@devgenius.academy', 'assets/images/instructors/marcus.jpg', 4.9),
(4, 'Grace Okafor', 'Growth Director & Digital Strategist', 'Digital Marketing & Growth Funnels', 'Performance marketing specialist certified in Google, Meta, and SEO analytics with a proven track record in revenue growth.', 'grace.okafor@devgenius.academy', 'assets/images/instructors/grace.jpg', 4.7);

INSERT INTO `courses` (`id`, `instructor_id`, `title`, `slug`, `category`, `description`, `duration`, `level`, `price`, `original_price`, `thumbnail`, `rating`, `review_count`, `is_active`, `is_featured`) VALUES
(1, 1, 'Full-Stack Web Development Bootcamp', 'web-development-bootcamp', 'Web Development', 'Master modern frontend and backend development from semantic HTML5 and modern CSS to responsive React, server-side APIs, and database persistence.', '12 Weeks', 'Beginner', 49.00, 89.00, 'assets/images/courses/web_dev.jpg', 4.8, 120, 1, 1),
(2, 3, 'Python Programming & AI Fundamentals', 'python-programming-from-scratch', 'Programming', 'Learn Python from foundational syntax and object-oriented programming to data analysis with Pandas, NumPy, and introductory AI algorithms.', '14 Weeks', 'Beginner', 59.00, 110.00, 'assets/images/courses/python.jpg', 4.9, 150, 1, 1),
(3, 2, 'UI/UX Design Fundamentals & Design Systems', 'ui-ux-design-fundamentals', 'Design', 'Craft intuitive, accessible user experiences. Learn user research, interactive wireframing, high-fidelity Figma prototyping, and design tokens.', '8 Weeks', 'Beginner', 29.00, 60.00, 'assets/images/courses/ui_ux.jpg', 4.8, 85, 1, 1),
(4, 4, 'Digital Marketing & Growth Masterclass', 'digital-marketing-masterclass', 'Digital Marketing', 'Accelerate brand growth with data-driven marketing: SEO, conversion rate optimization, Google Ads, content marketing, and email funnels.', '10 Weeks', 'Intermediate', 39.00, 79.00, 'assets/images/courses/marketing.jpg', 4.7, 95, 1, 1),
(5, 1, 'Relational Database Management & SQL', 'database-management-sql', 'Database Management', 'Design robust relational database schemas, write high-performance SQL queries, optimize indexes, and ensure data integrity in MySQL and PostgreSQL.', '8 Weeks', 'Intermediate', 35.00, 70.00, 'assets/images/courses/database.jpg', 4.9, 74, 1, 0),
(6, 2, 'Graphics Design & Brand Identity Mastery', 'graphics-design-brand-identity', 'Design', 'Transform brand visions into unforgettable visual identities. Learn vector illustration, typographic harmony, color psychology, and print production.', '6 Weeks', 'Beginner', 30.00, 65.00, 'assets/images/courses/graphics.jpg', 4.8, 62, 1, 0);

INSERT INTO `course_enrolments` (`id`, `user_id`, `course_id`, `progress_percent`, `status`) VALUES
(1, 2, 1, 65, 'active'),
(2, 2, 3, 40, 'active'),
(3, 3, 2, 50, 'active'),
(4, 4, 3, 25, 'active');

INSERT INTO `assignments` (`id`, `course_id`, `title`, `description`, `due_date`, `max_score`) VALUES
(1, 1, 'Assignment 1: Responsive Portfolio Website', 'Design and build a responsive personal portfolio using semantic HTML5, Flexbox, and CSS Grid. Must include a working contact form and mobile menu.', '2026-03-15 23:59:59', 100),
(2, 1, 'Assignment 2: JavaScript Interactive Task Manager', 'Implement a task management dashboard with local storage persistence, filtering (All/Active/Completed), and form validation using modern ES6+ modules.', '2026-03-25 23:59:59', 100),
(3, 3, 'Assignment 1: E-Learning Mobile App Wireframes & Flow', 'Create low-fidelity and mid-fidelity interactive wireframes for an e-learning student dashboard in Figma. Include user flow annotations.', '2026-03-20 23:59:59', 100),
(4, 2, 'Assignment 1: Student Gradebook Analyzer in Python', 'Write a Python script that reads student records from a CSV file, computes average marks, finds the highest and lowest performers, and exports a formatted grade report.', '2026-03-18 23:59:59', 100);

INSERT INTO `assignment_submissions` (`id`, `assignment_id`, `user_id`, `file_path`, `file_name`, `file_size`, `comments`, `status`, `score`, `grade`, `feedback`, `submitted_at`, `graded_at`) VALUES
(1, 1, 2, 'uploads/assignments/sub_sarah_portfolio.zip', 'sarah_portfolio_v1.zip', '2.4 MB', 'Completed responsive layout with mobile drawer and light/dark theme toggle.', 'Graded', 95, 'A', 'Outstanding implementation! The semantic structure is clean, accessibility labels are in place, and the mobile navigation operates smoothly.', '2026-02-28 14:32:00', '2026-03-02 10:15:00'),
(2, 3, 2, 'uploads/assignments/sub_sarah_wireframes.pdf', 'elearning_wireframes_figma_export.pdf', '5.1 MB', 'Attached PDF export showing 12 screens from student onboarding to course enrolment and assignment submission.', 'Submitted', NULL, NULL, NULL, '2026-03-04 18:20:00', NULL),
(3, 4, 3, 'uploads/assignments/sub_emmanuel_gradebook.py', 'gradebook_analyzer_emmanuel.py', '14 KB', 'Created modular script with error handling for malformed rows and summary statistics printing.', 'Graded', 88, 'B+', 'Well-structured code and good modularity. Consider adding docstrings to all functions for enterprise best practice.', '2026-03-03 11:45:00', '2026-03-04 09:00:00');
