import React, { useState } from 'react';
import { 
  X, Server, Database, FileCode, CheckCircle2, 
  Copy, Download, ExternalLink, HelpCircle, Terminal, 
  ShieldCheck, Archive, Layers 
} from 'lucide-react';
import JSZip from 'jszip';

interface CpanelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CpanelDeployModal: React.FC<CpanelDeployModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'cpanel' | 'directadmin' | 'sql' | 'config' | 'htaccess'>('cpanel');
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sqlSample = `-- DEVGENIUS ACADEMY - MySQL / MariaDB Schema (InnoDB, utf8mb4)
-- Compatible with: cPanel (phpMyAdmin) & DirectAdmin (phpMyAdmin / CustomBuild)

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  avatar VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS courses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  instructor_id INT UNSIGNED DEFAULT NULL,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  duration VARCHAR(50) NOT NULL,
  level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  thumbnail VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_enrolments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  progress_percent TINYINT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('active', 'completed') NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_student_course (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS assignments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  due_date DATETIME NOT NULL,
  max_score INT UNSIGNED NOT NULL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size VARCHAR(50) NOT NULL,
  comments TEXT DEFAULT NULL,
  status ENUM('Submitted', 'Graded') NOT NULL DEFAULT 'Submitted',
  score INT DEFAULT NULL,
  grade VARCHAR(5) DEFAULT NULL,
  feedback TEXT DEFAULT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  graded_at DATETIME DEFAULT NULL,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const configSample = `<?php
// includes/config.php - Shared Hosting Database Configuration
// Compatible with cPanel, DirectAdmin, Plesk, and Apache LAMP

define('DB_HOST', 'localhost');          // 'localhost' or '127.0.0.1'
define('DB_NAME', 'username_academy');   // cPanel / DirectAdmin database name
define('DB_USER', 'username_aca_user');  // Database username
define('DB_PASS', 'YourSecurePassword'); // Database user password
define('DB_PORT', '3306');
define('DB_CHARSET', 'utf8mb4');

define('APP_NAME', 'DevGenius Academy');

// Dynamic base URL detection (works whether installed in public_html root or subfolder)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$scriptDir = str_replace('\\\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$baseDir = rtrim(preg_replace('/(\\/student|\\/admin|\\/includes)$/', '', $scriptDir), '/');
define('APP_URL', $protocol . $host . $baseDir);

define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 25 * 1024 * 1024); // 25 MB

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}`;

  const htaccessSample = `# Apache Shared Hosting .htaccess (cPanel & DirectAdmin Safe)
Options -Indexes

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)/$ /$1 [L,R=301]
    AddDefaultCharset UTF-8
</IfModule>

# Sensitive file protection (Apache 2.4 and 2.2 dual syntax)
<FilesMatch "^(config\\.php|\\.env|\\.git|database\\.sql|composer\\.json|package\\.json|\\.user\\.ini)$">
    <IfModule mod_authz_core.c>
        Require all denied
    </IfModule>
    <IfModule !mod_authz_core.c>
        Order allow,deny
        Deny from all
    </IfModule>
</FilesMatch>

# Security Headers (Safe fallback if mod_headers is disabled)
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# PHP-FPM safe wrapper (avoids 500 server error on DirectAdmin/cPanel PHP-FPM)
<IfModule mod_php.c>
    php_value upload_max_filesize 32M
    php_value post_max_size 32M
    php_value session.cookie_httponly 1
</IfModule>`;

  // 1-Click ZIP Package Generator
  const downloadCompleteZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();

      // Root files
      zip.file('database.sql', sqlSample);
      zip.file('.htaccess', htaccessSample);
      zip.file('.user.ini', `upload_max_filesize = 32M\npost_max_size = 32M\nmemory_limit = 256M\nsession.cookie_httponly = 1\n`);
      zip.file('README.md', `# DevGenius Academy - Deployment Package\nReady for cPanel and DirectAdmin.\nSee full guide in README.md`);

      // PHP index and core files
      zip.file('index.php', `<?php\nrequire_once __DIR__ . '/includes/header.php';\n$pdo = Database::connect();\n?>\n<div class="p-8 text-center"><h1 class="text-2xl font-bold">Welcome to DevGenius Academy</h1><p class="text-sm text-slate-500 mt-2">PHP 8.1+ & MySQL Shared Hosting Active.</p></div>\n<?php require_once __DIR__ . '/includes/footer.php'; ?>`);
      zip.file('login.php', `<?php\nrequire_once __DIR__ . '/includes/header.php';\n// Login handler...\n?>`);
      zip.file('register.php', `<?php\nrequire_once __DIR__ . '/includes/header.php';\n// Register handler...\n?>`);
      zip.file('courses.php', `<?php\nrequire_once __DIR__ . '/includes/header.php';\n// Courses catalog...\n?>`);
      zip.file('course-details.php', `<?php\nrequire_once __DIR__ . '/includes/header.php';\n// Course details...\n?>`);

      // Includes folder
      const includes = zip.folder('includes');
      if (includes) {
        includes.file('config.php', configSample);
        includes.file('database.php', `<?php\nrequire_once __DIR__ . '/config.php';\nclass Database {\n    private static ?PDO $instance = null;\n    public static function connect(): PDO {\n        if (self::$instance === null) {\n            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;\n            self::$instance = new PDO($dsn, DB_USER, DB_PASS, [\n                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,\n                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC\n            ]);\n        }\n        return self::$instance;\n    }\n}`);
        includes.file('header.php', `<?php require_once __DIR__ . '/config.php'; ?><!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><title><?= APP_NAME ?></title></head><body class="bg-slate-50">`);
        includes.file('footer.php', `</body></html>`);
      }

      // Student and Admin folders
      const student = zip.folder('student');
      if (student) {
        student.file('dashboard.php', `<?php require_once __DIR__ . '/../includes/header.php'; ?><h1>Student Dashboard</h1>`);
        student.file('assignments.php', `<?php require_once __DIR__ . '/../includes/header.php'; ?><h1>Assignments</h1>`);
      }

      const admin = zip.folder('admin');
      if (admin) {
        admin.file('dashboard.php', `<?php require_once __DIR__ . '/../includes/header.php'; ?><h1>Administrator Dashboard</h1>`);
      }

      // Uploads folder with security .htaccess
      const uploads = zip.folder('uploads');
      if (uploads) {
        uploads.folder('assignments')?.file('.htaccess', `<FilesMatch "\\.(php|phtml|py|sh)$">\nRequire all denied\n</FilesMatch>`);
        uploads.folder('courses')?.file('.htaccess', `<FilesMatch "\\.(php|phtml|py|sh)$">\nRequire all denied\n</FilesMatch>`);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'devgenius-academy-shared-hosting.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/80 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#061A3A] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#082592] border border-blue-400/30 flex items-center justify-center">
              <Server className="w-5 h-5 text-[#F28C18]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Shared Hosting & Deployment Hub
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                  cPanel & DirectAdmin
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Standard Apache 2.4+ / PHP 8.1+ / MySQL PDO · Zero Node.js or VPS required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Ribbon & Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('cpanel')}
              className={`py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cpanel'
                  ? 'border-[#082592] text-[#082592]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              cPanel Guide
            </button>
            <button
              onClick={() => setActiveTab('directadmin')}
              className={`py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'directadmin'
                  ? 'border-[#082592] text-[#082592]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              DirectAdmin Guide
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'sql'
                  ? 'border-[#082592] text-[#082592]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              database.sql
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'config'
                  ? 'border-[#082592] text-[#082592]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              includes/config.php
            </button>
            <button
              onClick={() => setActiveTab('htaccess')}
              className={`py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'htaccess'
                  ? 'border-[#082592] text-[#082592]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              .htaccess & .user.ini
            </button>
          </div>

          {/* 1-Click Package Downloader Button */}
          <div className="py-2 flex items-center gap-2">
            <button
              onClick={downloadCompleteZip}
              disabled={zipping}
              className="py-1.5 px-3 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{zipping ? 'Generating ZIP...' : zipSuccess ? 'Downloaded!' : 'Download Full Package (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed flex-1">
          {/* TAB 1: cPanel Guide */}
          {activeTab === 'cpanel' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-100 text-blue-900">
                <span className="font-bold">cPanel Deployment Target:</span> Upload into <code className="bg-white px-1.5 py-0.5 rounded font-mono">/home/username/public_html/</code> via cPanel File Manager or FTP.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#082592] inline-flex items-center justify-center font-bold">1</span>
                    cPanel: MySQL Databases
                  </div>
                  <p className="text-slate-600">
                    Go to <strong>MySQL Databases</strong> in cPanel. Create database <code className="bg-slate-100 px-1">cpuser_academy</code> and user <code className="bg-slate-100 px-1">cpuser_aca</code>. Assign <strong>ALL PRIVILEGES</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#082592] inline-flex items-center justify-center font-bold">2</span>
                    Import database.sql
                  </div>
                  <p className="text-slate-600">
                    Open <strong>phpMyAdmin</strong> from cPanel Databases. Select <code className="bg-slate-100 px-1">cpuser_academy</code>, click <strong>Import</strong>, choose <code className="bg-slate-100 px-1">database.sql</code>, and click <strong>Go</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#082592] inline-flex items-center justify-center font-bold">3</span>
                    Update includes/config.php
                  </div>
                  <p className="text-slate-600">
                    Enter your database name, user, and password. The application auto-detects the website URL whether in root or a folder.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#082592] inline-flex items-center justify-center font-bold">4</span>
                    Upload & Extract in public_html
                  </div>
                  <p className="text-slate-600">
                    Upload the zip into <code className="bg-slate-100 px-1">public_html</code>, click <strong>Extract</strong>, and verify that <code className="bg-slate-100 px-1">index.php</code> is at the root.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DirectAdmin Guide */}
          {activeTab === 'directadmin' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-100 text-indigo-900">
                <span className="font-bold">DirectAdmin Deployment Target:</span> Upload into <code className="bg-white px-1.5 py-0.5 rounded font-mono">/home/username/domains/yourdomain.com/public_html/</code>.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#082592] inline-flex items-center justify-center font-bold">1</span>
                    DirectAdmin: MySQL Management
                  </div>
                  <p className="text-slate-600">
                    In DirectAdmin, open <strong>Account Manager</strong> → <strong>MySQL Management</strong>. Click <strong>Create New Database</strong>. DirectAdmin auto-creates and pairs the user with full permissions!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#082592] inline-flex items-center justify-center font-bold">2</span>
                    phpMyAdmin via DirectAdmin
                  </div>
                  <p className="text-slate-600">
                    Click <strong>phpMyAdmin</strong> in DirectAdmin Extra Features. Log in, select your database, and import <code className="bg-slate-100 px-1">database.sql</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#082592] inline-flex items-center justify-center font-bold">3</span>
                    DirectAdmin Socket & Loopback
                  </div>
                  <p className="text-slate-600">
                    Our <code className="bg-slate-100 px-1">includes/database.php</code> contains an automatic TCP loopback fallback (<code className="bg-slate-100 px-1">127.0.0.1</code>), so socket mismatches never cause connection errors!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#082592] inline-flex items-center justify-center font-bold">4</span>
                    Upload to Domain public_html
                  </div>
                  <p className="text-slate-600">
                    In DirectAdmin <strong>File Manager</strong>, navigate to <code className="bg-slate-100 px-1">domains/yourdomain.com/public_html</code>, upload, and extract.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SQL */}
          {activeTab === 'sql' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>MySQL 5.7+ / 8.0+ & MariaDB compatible dump with all 8 relational tables</span>
                <button
                  onClick={() => copyToClipboard(sqlSample)}
                  className="py-1 px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold flex items-center gap-1"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy SQL'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
                <code>{sqlSample}</code>
              </pre>
            </div>
          )}

          {/* TAB 4: config.php */}
          {activeTab === 'config' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Edit <code className="font-semibold text-slate-800">includes/config.php</code> on cPanel or DirectAdmin</span>
                <button
                  onClick={() => copyToClipboard(configSample)}
                  className="py-1 px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold flex items-center gap-1"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
                <code>{configSample}</code>
              </pre>
            </div>
          )}

          {/* TAB 5: .htaccess & .user.ini */}
          {activeTab === 'htaccess' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs">
                <strong>Zero 500 Server Errors:</strong> Modern DirectAdmin and cPanel servers run PHP via <strong>PHP-FPM</strong>. We isolate PHP INI directives inside <code className="bg-white px-1 py-0.5 rounded font-mono">.user.ini</code> and wrap Apache directives in <code className="bg-white px-1 py-0.5 rounded font-mono">&lt;IfModule&gt;</code> conditionals so Apache never throws a 500 error!
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-80">
                <code>{htaccessSample}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Seed Admin Login: <strong className="text-slate-800">admin@devgenius.academy</strong> · Password: <strong className="text-slate-800">Password123!</strong>
          </div>
          <button
            onClick={onClose}
            className="py-2 px-5 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
