# DevGenius Academy — Shared Hosting Deployment Guide (cPanel & DirectAdmin)

This documentation provides complete, production-tested instructions for deploying the **DevGenius Academy** e-learning website and student registration portal on any standard Apache shared hosting server, explicitly covering both **cPanel** and **DirectAdmin** control panels.

---

## ⚡ 1. QUICKEST METHOD: Automatic Web-Based Installer

DevGenius Academy includes a built-in **Automatic Web Installer** (`install.php`) that removes all manual SQL imports and config edits:

1. **Upload Files:** Upload the project zip into `public_html` (cPanel) or `domains/yourdomain.com/public_html` (DirectAdmin) and extract.
2. **Open Your Website:** Visit your website in any web browser (`https://yourdomain.com/` or `https://yourdomain.com/install.php`).
3. **Enter Database Credentials:**
   * **Database Name** (e.g. `cpaneluser_academy`)
   * **Database Username** (e.g. `cpaneluser_aca_user`)
   * **Database Password**
4. **Click "Test Connection & Auto-Install Database":**
   * The installer automatically tests connectivity.
   * If correct, it automatically finds `database.sql`, imports all 8 tables and sample curriculum, generates and writes `includes/config.php`, and creates a security lock (`installed.lock`).
   * You're done in 60 seconds!

---

## 2. System Requirements

* **Web Server:** Apache 2.4+ (or LiteSpeed / OpenLiteSpeed)
* **PHP Version:** PHP 8.1, 8.2, or 8.3 (Supported via mod_php or PHP-FPM)
* **PHP Extensions:** `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `session`
* **Database:** MySQL 5.7+, MySQL 8.0+, or MariaDB 10.3+
* **Build Tools on Server:** **NONE** (Zero Node.js, zero npm, zero background daemons required on production host).

---

## 3. Server Architecture Differences (cPanel vs DirectAdmin)

| Feature | cPanel Hosting | DirectAdmin Hosting |
|---|---|---|
| **Root Web Directory** | `/home/{username}/public_html/` | `/home/{username}/domains/{domain.com}/public_html/` |
| **MySQL Tool** | *Databases* → *MySQL® Databases* | *Account Manager* → *MySQL Management* |
| **phpMyAdmin Access** | *Databases* → *phpMyAdmin* | *Extra Features* → *phpMyAdmin* |
| **PHP Version Selector** | *Software* → *MultiPHP Manager* | *Domain Administration* → *PHP Version Selector* |
| **PHP INI Overrides** | MultiPHP INI Editor / `.user.ini` | `.user.ini` |
| **Default Hostname** | `localhost` | `localhost` (or `127.0.0.1` TCP loopback) |

---

## 3. Step-by-Step Installation: cPanel Hosting

### Step 1: Create Database & User in cPanel
1. Log into your **cPanel** dashboard (`https://yourdomain.com:2083`).
2. Navigate to **Databases** → **MySQL® Databases**.
3. Under **Create New Database**, enter a name (e.g. `academy`). Note your full prefix (e.g., `cpuser_academy`).
4. Scroll to **Add New User**, enter username `cpuser_aca`, generate a strong password, and click **Create User**.
5. Scroll to **Add User to Database**, select your user and database, click **Add**, and check **ALL PRIVILEGES**. Click **Make Changes**.

### Step 2: Import `database.sql` via phpMyAdmin
1. In cPanel, click **phpMyAdmin** under **Databases**.
2. Select your new database (`cpuser_academy`) in the left sidebar.
3. Click the **Import** tab at the top.
4. Click **Choose File**, select `database.sql`, and click **Go** (or **Import**). All 8 tables will be created and seeded.

### Step 3: Configure Database Credentials
Open `includes/config.php` via cPanel File Manager and edit:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpuser_academy');
define('DB_USER', 'cpuser_aca');
define('DB_PASS', 'YourStrongPasswordHere');
```

### Step 4: Upload Application Files
1. Open **File Manager** in cPanel.
2. Enter `/public_html/`.
3. Upload the project ZIP and click **Extract**. Ensure `index.php`, `.htaccess`, `.user.ini`, `includes/`, `student/`, and `admin/` sit directly inside `public_html`.

---

## 4. Step-by-Step Installation: DirectAdmin Hosting

### Step 1: Create Database & User in DirectAdmin
1. Log into your **DirectAdmin** panel (`https://yourdomain.com:2222`).
2. Under **Account Manager**, click **MySQL Management**.
3. Click **Create New Database**.
4. Enter:
   * **Database Name:** `academy` (creates `dauser_academy`)
   * **Database User:** Same as DB name or customize
   * **Database Password:** Enter or generate strong password
5. Click **Create Database**. DirectAdmin automatically attaches the user with all necessary privileges!

### Step 2: Import `database.sql` via phpMyAdmin in DirectAdmin
1. In DirectAdmin, click **phpMyAdmin** (accessible from MySQL Management or Extra Features).
2. Log in with your new database user credentials (or DirectAdmin master credentials).
3. Select `dauser_academy` from the database tree.
4. Click **Import** → Choose `database.sql` → Click **Go**.

### Step 3: Configure Database Credentials
Edit `includes/config.php`:
```php
define('DB_HOST', 'localhost'); // If socket issues occur, use '127.0.0.1' (handled automatically)
define('DB_NAME', 'dauser_academy');
define('DB_USER', 'dauser_academy');
define('DB_PASS', 'YourDirectAdminPassword');
```

### Step 4: Upload Application Files to DirectAdmin Path
1. In DirectAdmin, open **System Info & Files** → **File Manager**.
2. Navigate to:
   ```
   /domains/{yourdomain.com}/public_html/
   ```
3. Upload and extract the project files into this `public_html` directory.

---

## 5. File Permissions & Security Configuration

Ensure the following Linux permissions:
* **All Folders:** `755` (`drwxr-xr-x`)
* **All PHP/HTML Files:** `644` (`-rw-r--r--`)
* **Uploads Directory:**
  * `uploads/assignments/` → `755`
  * `uploads/courses/` → `755`

### Built-in Apache Security Measures:
* **`.htaccess`:** Dual Apache 2.4 (`Require all denied`) and Apache 2.2 (`Order allow,deny`) compatibility to prevent 500 server errors regardless of server age.
* **PHP-FPM Safe:** PHP directives are encapsulated within `<IfModule mod_php.c>` so PHP-FPM (default on DirectAdmin & modern cPanel) will not crash with a 500 error.
* **`.user.ini`:** Provides portable per-directory upload limits (`upload_max_filesize = 32M`, `post_max_size = 32M`) recognized by PHP-FPM.
* **`uploads/assignments/.htaccess`:** Disables direct execution of any uploaded `.php`, `.phtml`, `.cgi`, or script files.

---

## 6. Initial Administrator Login

* **Default Admin Email:** `admin@devgenius.academy`
* **Default Password:** `Password123!`
* Log in at `https://yourdomain.com/login.php`. Once logged in, update your password in the admin console.

---

## 7. Troubleshooting Common Shared Hosting Errors

| Problem | Root Cause | Solution |
|---|---|---|
| **500 Internal Server Error** | Invalid `.htaccess` directive on strict Apache | Our `.htaccess` wraps all mod_php & mod_headers directives in `<IfModule>`. Verify Apache error log in cPanel (*Errors*) or DirectAdmin (*Log Viewer*). |
| **SQLSTATE Connection Refused** | Socket path mismatch on DirectAdmin | Our `includes/database.php` automatically falls back to `127.0.0.1` TCP loopback. Ensure user has access in MySQL Management. |
| **File Upload Fails (> 2MB)** | Default PHP `upload_max_filesize` is 2MB | `.user.ini` sets this to 32MB. Alternatively, increase in cPanel *MultiPHP INI Editor* or DirectAdmin *PHP Settings*. |
| **Session Expiring Instantly** | Unwritable `/tmp` session path | Add `ini_set('session.save_path', __DIR__ . '/../tmp');` inside `includes/config.php` if host temp directory is full. |
