<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

if (isLoggedIn()) {
    redirectByRole(currentUser()['role']);
}

$error = '';
$success = flash('success');
$old = ['email' => ''];
$adminMode = !empty($adminLogin);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        $error = 'Invalid form submission. Please try again.';
    } else {
        $old['email'] = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $result = authenticateUser($old['email'], $password);

        if ($result['success']) {
            $user = $result['user'];
            if ($adminMode && !in_array($user['role'], ['admin', 'staff', 'product_manager'], true)) {
                $error = 'Access denied. Admin credentials required.';
            } else {
                loginUser($user);
                redirectByRole($user['role']);
            }
        } else {
            $error = $result['error'];
        }
    }
}

$pageTitle = ($adminMode ? 'Admin Login' : 'Login') . ' — ' . APP_NAME;
$bodyClass = 'page-auth';
include __DIR__ . '/includes/header.php';
?>

<div class="auth-container">
    <div class="auth-card">
        <?php if ($adminMode): ?>
            <div class="admin-badge">🛡️ Admin Portal</div>
            <h1>Staff & Admin Login</h1>
            <p class="auth-subtitle">For Admin, Staff, and Product Manager accounts</p>
        <?php else: ?>
            <h1>Welcome Back</h1>
            <p class="auth-subtitle">Login to your Kalippetti account</p>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert alert-success"><p><?= e($success) ?></p></div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-error"><p><?= e($error) ?></p></div>
        <?php endif; ?>

        <form method="POST" action="" class="auth-form">
            <?= csrfField() ?>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" value="<?= e($old['email']) ?>"
                       placeholder="you@example.com" required autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password"
                       placeholder="Your password" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Login</button>
        </form>

        <p class="auth-footer">
            <?php if ($adminMode): ?>
                <a href="<?= BASE_URL ?>/login.php">← Customer Login</a>
            <?php else: ?>
                Don't have an account? <a href="<?= BASE_URL ?>/register.php">Register here</a>
                &nbsp;·&nbsp;
                <a href="<?= BASE_URL ?>/admin/login.php">Admin Login</a>
            <?php endif; ?>
        </p>
    </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
