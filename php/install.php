<?php

declare(strict_types=1);

/**
 * One-time setup script — run via browser after importing database.sql
 * Creates default admin/staff/product_manager accounts with password: Admin@123
 * DELETE this file after setup in production!
 */

require_once __DIR__ . '/config/database.php';

$password = 'Admin@123';
$hash = password_hash($password, PASSWORD_DEFAULT);

$accounts = [
    ['Super Admin',    'admin@kalippetti.com',  'admin'],
    ['Staff Member',   'staff@kalippetti.com',  'staff'],
    ['Product Manager','pm@kalippetti.com',     'product_manager'],
];

$messages = [];

try {
    $db = getDB();

    foreach ($accounts as [$name, $email, $role]) {
        $check = $db->prepare('SELECT id FROM users WHERE email = ?');
        $check->execute([$email]);

        if ($check->fetch()) {
            $update = $db->prepare('UPDATE users SET password = ?, full_name = ?, role = ? WHERE email = ?');
            $update->execute([$hash, $name, $role, $email]);
            $messages[] = "Updated: $email ($role)";
        } else {
            $insert = $db->prepare('INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)');
            $insert->execute([$name, $email, $hash, $role]);
            $messages[] = "Created: $email ($role)";
        }
    }
} catch (PDOException $e) {
    $messages[] = 'Database error: ' . $e->getMessage();
    $messages[] = 'Make sure MySQL is running and you imported database.sql first.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Setup — Kalippetti Auth</title>
    <link rel="stylesheet" href="/php/assets/css/style.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <h1>Setup Complete</h1>
            <?php foreach ($messages as $msg): ?>
                <p><?= htmlspecialchars($msg) ?></p>
            <?php endforeach; ?>
            <hr style="margin:1.5rem 0;border:none;border-top:1px solid #e2e8f0">
            <h3>Default Login Accounts</h3>
            <table class="data-table" style="margin:1rem 0">
                <tr><th>Role</th><th>Email</th><th>Password</th></tr>
                <tr><td>Admin</td><td>admin@kalippetti.com</td><td>Admin@123</td></tr>
                <tr><td>Staff</td><td>staff@kalippetti.com</td><td>Admin@123</td></tr>
                <tr><td>Product Manager</td><td>pm@kalippetti.com</td><td>Admin@123</td></tr>
            </table>
            <a href="/php/login.php" class="btn btn-primary btn-block">Go to Login</a>
            <p class="auth-footer" style="color:#ef4444;margin-top:1rem">⚠️ Delete install.php after setup!</p>
        </div>
    </div>
</body>
</html>
