<?php
/**
 * DevGenius Academy - Secure PDO Database Handler
 * Compatible with cPanel (MySQL 5.7/8.0, MariaDB) & DirectAdmin (CustomBuild MySQL/MariaDB)
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;

    public static function connect(): PDO {
        if (self::$instance === null) {
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ];

            // Primary attempt using configured DB_HOST
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // Shared Hosting Fallback: If 'localhost' socket failed, attempt direct TCP loopback '127.0.0.1'
                // This reliably fixes the common DirectAdmin socket mismatch (/tmp/mysql.sock vs /var/lib/mysql/mysql.sock)
                if (DB_HOST === 'localhost') {
                    try {
                        $fallbackDsn = "mysql:host=127.0.0.1;port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
                        self::$instance = new PDO($fallbackDsn, DB_USER, DB_PASS, $options);
                        return self::$instance;
                    } catch (PDOException $eFallback) {
                        // Pass through to error display below
                    }
                }

                // Render friendly diagnostic message instead of blank screen
                $dbName = htmlspecialchars(DB_NAME);
                $dbUser = htmlspecialchars(DB_USER);
                $errMsg = htmlspecialchars($e->getMessage());

                die("
                <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <title>Database Connection Error - DevGenius Academy</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F8FAFC; color: #1E293B; padding: 40px 20px; line-height: 1.6; }
                        .card { max-width: 650px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                        h2 { color: #082592; margin-top: 0; font-size: 22px; }
                        .code { background: #0F172A; color: #F1F5F9; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 13px; overflow-x: auto; margin: 15px 0; }
                        .tips { background: #EFF6FF; border-left: 4px solid #1D4ED8; padding: 12px 16px; margin-top: 20px; border-radius: 0 8px 8px 0; font-size: 13px; }
                        ol { padding-left: 20px; font-size: 13px; }
                        li { margin-bottom: 8px; }
                    </style>
                </head>
                <body>
                    <div class='card'>
                        <h2>DevGenius Academy — Database Connection Issue</h2>
                        <p>The application could not connect to your MySQL database with the credentials provided in <code>includes/config.php</code>.</p>
                        
                        <div class='code'>$errMsg</div>

                        <div class='tips'>
                            <strong>Quick Shared Hosting Checks (cPanel & DirectAdmin):</strong>
                            <ol>
                                <li><strong>cPanel:</strong> Verify database name is prefixed with your cPanel username (e.g. <code>{$dbName}</code>) and your user has <strong>ALL PRIVILEGES</strong> assigned.</li>
                                <li><strong>DirectAdmin:</strong> Go to <strong>MySQL Management</strong>, confirm the user exists and has access to the database.</li>
                                <li><strong>phpMyAdmin:</strong> Ensure you imported <code>database.sql</code> into this database.</li>
                                <li>Edit <code>includes/config.php</code> via File Manager to update <code>DB_USER</code> and <code>DB_PASS</code>.</li>
                            </ol>
                        </div>
                    </div>
                </body>
                </html>
                ");
            }
        }
        return self::$instance;
    }
}
