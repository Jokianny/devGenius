<?php
/**
 * DevGenius Academy - Authentication & Security Helpers
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

function get_current_user_account(): ?array {
    if (empty($_SESSION['user_id'])) {
        return null;
    }
    try {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT id, full_name, email, phone, role, avatar, bio, created_at FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        return $stmt->fetch() ?: null;
    } catch (Exception $e) {
        return null;
    }
}

function require_student(): array {
    $user = get_current_user_account();
    if (!$user) {
        header("Location: ../login.php?redirect=" . urlencode($_SERVER['REQUEST_URI'] ?? ''));
        exit;
    }
    return $user;
}

function require_admin(): array {
    $user = get_current_user_account();
    if (!$user || $user['role'] !== 'admin') {
        header("Location: ../login.php?error=unauthorized_admin");
        exit;
    }
    return $user;
}

function generate_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token(?string $token): bool {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

function sanitize(?string $data): string {
    if ($data === null) return '';
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
