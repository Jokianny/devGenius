<?php
/**
 * DevGenius Academy - Core Configuration
 * Compatible with cPanel, DirectAdmin, Plesk, and Apache LAMP/WAMP/MAMP
 */

// Database Credentials (Auto-configured by install.php or customized here)
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', 'devgenius_academy');
if (!defined('DB_USER')) define('DB_USER', 'root');
if (!defined('DB_PASS')) define('DB_PASS', '');
if (!defined('DB_PORT')) define('DB_PORT', '3306');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');

if (!defined('APP_NAME')) define('APP_NAME', 'DevGenius Academy');

// Dynamic base URL detection
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || ($_SERVER['SERVER_PORT'] ?? 80) == 443) ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$baseDir = rtrim(preg_replace('/(\/(student|admin|includes))$/', '', $scriptDir), '/');
if (!defined('APP_URL')) define('APP_URL', $protocol . $host . $baseDir);

// Uploads configuration
if (!defined('UPLOAD_DIR')) define('UPLOAD_DIR', __DIR__ . '/../uploads/');
if (!defined('MAX_UPLOAD_SIZE')) define('MAX_UPLOAD_SIZE', 25 * 1024 * 1024); // 25 MB

// Session initialization
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}
