<?php
/**
 * DevGenius Academy - Core Configuration File
 * Works on ANY Apache Shared Hosting (cPanel, DirectAdmin, Plesk, LAMP)
 */

// ----------------------------------------------------------------------------
// 1. MySQL Database Settings (Update these from cPanel / DirectAdmin)
// ----------------------------------------------------------------------------
define('DB_HOST', 'localhost');          // 'localhost' or '127.0.0.1'
define('DB_NAME', 'cpaneluser_academy'); // cPanel: username_dbname | DirectAdmin: username_dbname
define('DB_USER', 'cpaneluser_academy_user'); // Database User
define('DB_PASS', 'Password123!');      // Database Password
define('DB_PORT', '3306');
define('DB_CHARSET', 'utf8mb4');

// ----------------------------------------------------------------------------
// 2. Application & Path Settings
// ----------------------------------------------------------------------------
define('APP_NAME', 'DevGenius Academy');

// Auto-detect base URL dynamically for root or subdirectory installations
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || ($_SERVER['SERVER_PORT'] ?? 80) == 443) ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$baseDir = rtrim(preg_replace('/(\/student|\/admin|\/includes)$/', '', $scriptDir), '/');
define('APP_URL', $protocol . $host . $baseDir);

define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 25 * 1024 * 1024); // 25 MB

// ----------------------------------------------------------------------------
// 3. Secure Session Initialization (Safe for mod_php and PHP-FPM)
// ----------------------------------------------------------------------------
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}
