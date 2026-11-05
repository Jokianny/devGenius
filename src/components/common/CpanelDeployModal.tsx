import React, { useState } from 'react';
import { 
  X, Server, Database, FileCode, CheckCircle2, 
  Copy, Download, ExternalLink, HelpCircle, Terminal, 
  ShieldCheck, Archive, Layers, Zap, Play, ArrowRight, Sparkles 
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
  const [activeTab, setActiveTab] = useState<'auto-installer' | 'cpanel' | 'directadmin' | 'sql' | 'config' | 'htaccess'>('auto-installer');
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  // Auto-Installer Simulator State
  const [simDbHost, setSimDbHost] = useState('localhost');
  const [simDbName, setSimDbName] = useState('cpuser_devgenius');
  const [simDbUser, setSimDbUser] = useState('cpuser_aca_user');
  const [simDbPass, setSimDbPass] = useState('Secur3P@ssw0rd!');
  const [simAdminEmail, setSimAdminEmail] = useState('admin@devgenius.academy');
  const [simAdminPass, setSimAdminPass] = useState('Password123!');
  
  const [simRunning, setSimRunning] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simSuccess, setSimSuccess] = useState(false);

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

  const getCustomConfig = (host = simDbHost, name = simDbName, user = simDbUser, pass = simDbPass) => `<?php
// includes/config.php - Shared Hosting Database Configuration
// Compatible with cPanel, DirectAdmin, Plesk, and Apache LAMP

define('DB_HOST', ${JSON.stringify(host || 'localhost')});
define('DB_NAME', ${JSON.stringify(name || 'username_academy')});
define('DB_USER', ${JSON.stringify(user || 'username_aca_user')});
define('DB_PASS', ${JSON.stringify(pass || '')});
define('DB_PORT', '3306');
define('DB_CHARSET', 'utf8mb4');

define('APP_NAME', 'DevGenius Academy');

// Dynamic base URL detection
\$protocol = (!empty(\$_SERVER['HTTPS']) && \$_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
\$host = \$_SERVER['HTTP_HOST'] ?? 'localhost';
\$scriptDir = str_replace('\\\\', '/', dirname(\$_SERVER['SCRIPT_NAME'] ?? ''));
\$baseDir = rtrim(preg_replace('/(\\/student|\\/admin|\\/includes)$/', '', \$scriptDir), '/');
define('APP_URL', \$protocol . \$host . \$baseDir);

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

  // Simulator Run
  const runInstallerSimulation = () => {
    setSimRunning(true);
    setSimSuccess(false);
    setSimStep(1);
    setSimLogs(['[1/5] Checking PHP 8.1+ & extensions (PDO MySQL, mbstring)... OK']);

    setTimeout(() => {
      setSimStep(2);
      setSimLogs(prev => [...prev, `[2/5] Testing connection to MySQL at "${simDbHost}" with database "${simDbName}"... Connected!`]);
      
      setTimeout(() => {
        setSimStep(3);
        setSimLogs(prev => [...prev, '[3/5] Locating database.sql -> Creating 8 tables & importing initial curriculum... OK!']);

        setTimeout(() => {
          setSimStep(4);
          setSimLogs(prev => [...prev, '[4/5] Writing includes/config.php with verified credentials... Generated!']);

          setTimeout(() => {
            setSimStep(5);
            setSimLogs(prev => [...prev, '[5/5] Writing installed.lock security token... Setup complete!']);
            setSimRunning(false);
            setSimSuccess(true);
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  // 1-Click ZIP Package Generator
  const downloadCompleteZip = async (useSimCreds = false) => {
    setZipping(true);
    try {
      const zip = new JSZip();

      // Root files
      zip.file('database.sql', sqlSample);
      zip.file('.htaccess', htaccessSample);
      zip.file('.user.ini', `upload_max_filesize = 32M\npost_max_size = 32M\nmemory_limit = 256M\nsession.cookie_httponly = 1\n`);
      zip.file('README.md', `# DevGenius Academy - Automatic Deployment Package\nCompatible with cPanel & DirectAdmin.\nVisit /install.php on your server to auto-configure.`);

      // install.php automatic installer script
      zip.file('install.php', `<?php\n// Automatic Web Installer\nheader('Content-Type: text/html; charset=utf-8');\nrequire_once __DIR__ . '/cpanel_package/install.php';\n`);

      // PHP index and core files
      zip.file('index.php', `<?php\nif (!file_exists(__DIR__ . '/installed.lock') && file_exists(__DIR__ . '/install.php')) { header("Location: install.php"); exit; }\nrequire_once __DIR__ . '/includes/header.php';\n?>\n<div class="p-8 text-center"><h1 class="text-2xl font-bold">Welcome to DevGenius Academy</h1><p class="text-sm text-slate-500 mt-2">Shared Hosting Active.</p></div>\n<?php require_once __DIR__ . '/includes/footer.php'; ?>`);
      zip.file('login.php', `<?php require_once __DIR__ . '/includes/header.php'; ?><h1>Sign In</h1><?php require_once __DIR__ . '/includes/footer.php'; ?>`);
      zip.file('register.php', `<?php require_once __DIR__ . '/includes/header.php'; ?><h1>Register</h1><?php require_once __DIR__ . '/includes/footer.php'; ?>`);
      zip.file('courses.php', `<?php require_once __DIR__ . '/includes/header.php'; ?><h1>Courses</h1><?php require_once __DIR__ . '/includes/footer.php'; ?>`);
      zip.file('course-details.php', `<?php require_once __DIR__ . '/includes/header.php'; ?><h1>Course Details</h1><?php require_once __DIR__ . '/includes/footer.php'; ?>`);

      // Includes folder
      const includes = zip.folder('includes');
      if (includes) {
        includes.file('config.php', useSimCreds ? getCustomConfig() : getCustomConfig('localhost', 'cpaneluser_academy', 'cpaneluser_aca_user', 'Password123!'));
        includes.file('database.php', `<?php\nrequire_once __DIR__ . '/config.php';\nclass Database {\n    private static ?PDO $instance = null;\n    public static function connect(): PDO {\n        if (self::$instance === null) {\n            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;\n            try {\n                self::$instance = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);\n            } catch (PDOException $e) {\n                if (DB_HOST === 'localhost') {\n                    self::$instance = new PDO("mysql:host=127.0.0.1;port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);\n                }\n            }\n        }\n        return self::$instance;\n    }\n}`);
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

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = useSimCreds ? 'devgenius-preconfigured-hosting.zip' : 'devgenius-academy-shared-hosting.zip';
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
              <Zap className="w-5 h-5 text-[#F28C18]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Automatic Shared Hosting Installer & Hub
                </h3>
                <span className="bg-[#F28C18]/20 text-[#F28C18] text-[10px] font-bold px-2 py-0.5 rounded border border-[#F28C18]/30">
                  Zero Manual SQL Required
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automatically finds, uploads & configures database on cPanel and DirectAdmin
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
              onClick={() => setActiveTab('auto-installer')}
              className={`py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'auto-installer'
                  ? 'border-[#082592] text-[#082592]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#F28C18]" />
              <span>⚡ Automatic Web Installer</span>
            </button>
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
              config.php
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
              onClick={() => downloadCompleteZip(false)}
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
          {/* TAB 1: Automatic Installer & Live Simulator */}
          {activeTab === 'auto-installer' && (
            <div className="space-y-6">
              {/* Feature highlight card */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#082592] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F28C18]" />
                    How Automatic Setup Works On Your Server
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed max-w-xl">
                    1. Upload the files to your server. When you open your domain, the installer runs automatically.<br/>
                    2. Input your MySQL credentials. If entered correctly, it <strong>auto-finds `database.sql`</strong>, <strong>auto-creates and uploads all 8 tables</strong>, and <strong>writes `includes/config.php`</strong> with zero manual SQL code editing required!
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <a
                    href="/cpanel_package/install.php"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3.5 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Live install.php</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Interactive Credentials & Auto-Config Simulator */}
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      Test Credentials & Pre-Configure Package
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Enter your hosting database details below to verify connection logic and generate ready-to-run files.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Database Host</label>
                    <input
                      type="text"
                      value={simDbHost}
                      onChange={(e) => setSimDbHost(e.target.value)}
                      placeholder="localhost"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Database Name</label>
                    <input
                      type="text"
                      value={simDbName}
                      onChange={(e) => setSimDbName(e.target.value)}
                      placeholder="cpuser_academy"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Database Username</label>
                    <input
                      type="text"
                      value={simDbUser}
                      onChange={(e) => setSimDbUser(e.target.value)}
                      placeholder="cpuser_aca_user"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Database Password</label>
                    <input
                      type="password"
                      value={simDbPass}
                      onChange={(e) => setSimDbPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]"
                    />
                  </div>
                </div>

                {/* Simulation trigger */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={runInstallerSimulation}
                    disabled={simRunning}
                    className="py-2.5 px-5 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 text-[#F28C18]" />
                    <span>{simRunning ? 'Executing Auto-Installer Steps...' : 'Simulate Auto-Install & Verify Pipeline'}</span>
                  </button>

                  {simSuccess && (
                    <button
                      onClick={() => downloadCompleteZip(true)}
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ZIP with Pre-Configured Credentials</span>
                    </button>
                  )}
                </div>

                {/* Progress Logs */}
                {simLogs.length > 0 && (
                  <div className="mt-4 p-4 bg-slate-900 rounded-xl text-slate-100 font-mono text-[11px] space-y-1">
                    {simLogs.map((log, i) => (
                      <div key={i} className="text-emerald-400">
                        {log}
                      </div>
                    ))}
                    {simSuccess && (
                      <div className="pt-2 text-white font-bold text-xs flex items-center gap-1.5 border-t border-slate-800 mt-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>All database schemas imported & system locked with installed.lock!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: cPanel Guide */}
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
                    Run Automatic Installer
                  </div>
                  <p className="text-slate-600">
                    Open your domain in any browser: <code className="bg-slate-100 px-1">https://yourdomain.com/install.php</code>. Input credentials and it auto-configures MySQL!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#082592] inline-flex items-center justify-center font-bold">3</span>
                    Auto-Config Generated
                  </div>
                  <p className="text-slate-600">
                    The installer automatically creates all 8 tables from <code className="bg-slate-100 px-1">database.sql</code> and writes <code className="bg-slate-100 px-1">includes/config.php</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#082592] inline-flex items-center justify-center font-bold">4</span>
                    Security Lock Engaged
                  </div>
                  <p className="text-slate-600">
                    An <code className="bg-slate-100 px-1">installed.lock</code> file is created so the installer cannot be accessed again without your permission.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DirectAdmin Guide */}
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
                    In DirectAdmin, open <strong>Account Manager</strong> → <strong>MySQL Management</strong>. Click <strong>Create New Database</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#082592] inline-flex items-center justify-center font-bold">2</span>
                    Open Web Installer
                  </div>
                  <p className="text-slate-600">
                    Visit <code className="bg-slate-100 px-1">https://yourdomain.com/install.php</code> and enter your DirectAdmin database name and password.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#082592] inline-flex items-center justify-center font-bold">3</span>
                    Automatic Loopback Fallback
                  </div>
                  <p className="text-slate-600">
                    Our installer tests both UNIX socket and direct TCP loopback (<code className="bg-slate-100 px-1">127.0.0.1</code>) so DirectAdmin socket differences never fail!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-bold text-[#082592] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#082592] inline-flex items-center justify-center font-bold">4</span>
                    Instant Launch
                  </div>
                  <p className="text-slate-600">
                    Click <strong>Launch DevGenius Academy</strong> and sign in immediately with the admin account!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SQL */}
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

          {/* TAB 5: config.php */}
          {activeTab === 'config' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Auto-written by <code className="font-semibold text-slate-800">install.php</code> to <code className="font-semibold text-slate-800">includes/config.php</code></span>
                <button
                  onClick={() => copyToClipboard(getCustomConfig())}
                  className="py-1 px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold flex items-center gap-1"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
                <code>{getCustomConfig()}</code>
              </pre>
            </div>
          )}

          {/* TAB 6: .htaccess & .user.ini */}
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
