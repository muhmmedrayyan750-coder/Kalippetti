<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

if (isLoggedIn()) {
    redirectByRole(currentUser()['role']);
}

$errors = [];
$old = ['full_name' => '', 'email' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        $errors[] = 'Invalid form submission. Please try again.';
    } else {
        $old['full_name'] = trim($_POST['full_name'] ?? '');
        $old['email'] = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirm = $_POST['confirm_password'] ?? '';

        if ($password !== $confirm) {
            $errors[] = 'Passwords do not match.';
        } else {
            $result = registerUser($old['full_name'], $old['email'], $password);
            if ($result['success']) {
                flash('success', 'Registration successful! Please login.');
                header('Location: ' . BASE_URL . '/login.php');
                exit;
            }
            $errors = $result['errors'];
        }
    }
}

$pageTitle = 'Register — ' . APP_NAME;
$bodyClass = 'page-auth';
include __DIR__ . '/includes/header.php';
?>

<div class="auth-container">
    <div class="auth-card">
        <h1>Create Account</h1>
        <p class="auth-subtitle">Join Kalippetti and shop premium toys for kids</p>

        <?php if ($errors): ?>
            <div class="alert alert-error">
                <?php foreach ($errors as $err): ?>
                    <p><?= e($err) ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="" class="auth-form" novalidate>
            <?= csrfField() ?>
            <div class="form-group">
                <label for="full_name">Full Name</label>
                <input type="text" id="full_name" name="full_name" value="<?= e($old['full_name']) ?>"
                       placeholder="Your full name" required minlength="2">
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" value="<?= e($old['email']) ?>"
                       placeholder="you@example.com" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password"
                       placeholder="Min. 8 characters" required minlength="8">
            </div>
            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" name="confirm_password"
                       placeholder="Repeat password" required minlength="8">
            </div>
            <button type="submit" class="btn btn-primary btn-block">Register</button>
        </form>

        <p class="auth-footer">
            Already have an account? <a href="<?= BASE_URL ?>/login.php">Login here</a>
        </p>
    </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
