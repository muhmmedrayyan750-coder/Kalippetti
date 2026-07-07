<?php

declare(strict_types=1);

const ROLES = ['user', 'admin', 'staff', 'product_manager'];

const ROLE_LABELS = [
    'user'            => 'Customer',
    'admin'           => 'Administrator',
    'staff'           => 'Staff',
    'product_manager' => 'Product Manager',
];

function csrfToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrfField(): string
{
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(csrfToken()) . '">';
}

function verifyCsrf(): bool
{
    $token = $_POST['csrf_token'] ?? '';
    return hash_equals(csrfToken(), $token);
}

function isLoggedIn(): bool
{
    return !empty($_SESSION['user_id']);
}

function currentUser(): ?array
{
    if (!isLoggedIn()) {
        return null;
    }

    static $user = null;
    if ($user === null) {
        $stmt = getDB()->prepare('SELECT id, full_name, email, role, created_at FROM users WHERE id = ? AND is_active = 1');
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch() ?: null;
        if (!$user) {
            logoutUser();
        }
    }
    return $user;
}

function hasRole(string ...$roles): bool
{
    $user = currentUser();
    return $user && in_array($user['role'], $roles, true);
}

function requireLogin(): void
{
    if (!isLoggedIn()) {
        header('Location: ' . BASE_URL . '/login.php');
        exit;
    }
}

function requireRole(string ...$roles): void
{
    requireLogin();
    if (!hasRole(...$roles)) {
        http_response_code(403);
        include __DIR__ . '/../403.php';
        exit;
    }
}

function redirectByRole(string $role): void
{
    $routes = [
        'admin'           => BASE_URL . '/admin/dashboard.php',
        'staff'           => BASE_URL . '/admin/staff-dashboard.php',
        'product_manager' => BASE_URL . '/admin/product-manager.php',
        'user'            => BASE_URL . '/user/dashboard.php',
    ];
    header('Location: ' . ($routes[$role] ?? BASE_URL . '/index.php'));
    exit;
}

function loginUser(array $user): void
{
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_name'] = $user['full_name'];
}

function logoutUser(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
}

function flash(string $key, ?string $message = null): ?string
{
    if ($message !== null) {
        $_SESSION['flash'][$key] = $message;
        return null;
    }
    $msg = $_SESSION['flash'][$key] ?? null;
    unset($_SESSION['flash'][$key]);
    return $msg;
}

function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

function registerUser(string $name, string $email, string $password): array
{
    $errors = [];

    if (strlen(trim($name)) < 2) {
        $errors[] = 'Full name must be at least 2 characters.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    }
    if (strlen($password) < 8) {
        $errors[] = 'Password must be at least 8 characters.';
    }

    if ($errors) {
        return ['success' => false, 'errors' => $errors];
    }

    $db = getDB();
    $check = $db->prepare('SELECT id FROM users WHERE email = ?');
    $check->execute([strtolower(trim($email))]);
    if ($check->fetch()) {
        return ['success' => false, 'errors' => ['This email is already registered.']];
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare('INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)');
    $stmt->execute([trim($name), strtolower(trim($email)), $hash, 'user']);

    return ['success' => true, 'user_id' => (int) $db->lastInsertId()];
}

function authenticateUser(string $email, string $password): array
{
    $db = getDB();
    $stmt = $db->prepare('SELECT id, full_name, email, password, role FROM users WHERE email = ? AND is_active = 1');
    $stmt->execute([strtolower(trim($email))]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        return ['success' => false, 'error' => 'Invalid email or password.'];
    }

    unset($user['password']);
    return ['success' => true, 'user' => $user];
}
