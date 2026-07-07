<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

$pageTitle = APP_NAME . ' — Shop Premium Toys';
$bodyClass = 'page-home';
include __DIR__ . '/includes/header.php';
?>

<section class="hero">
    <div class="container hero-inner">
        <h1>Welcome to <span class="text-primary">Kalippetti</span></h1>
        <p>Premium, non-toxic, educational, and creative toys for your kids.</p>
        <div class="hero-actions">
            <?php if (isLoggedIn()): ?>
                <a href="<?= BASE_URL ?>/user/dashboard.php" class="btn btn-primary btn-lg">Go to My Account</a>
            <?php else: ?>
                <a href="<?= BASE_URL ?>/register.php" class="btn btn-primary btn-lg">Create Account</a>
                <a href="<?= BASE_URL ?>/login.php" class="btn btn-outline btn-lg">Login</a>
            <?php endif; ?>
        </div>
    </div>
</section>

<section class="features container">
    <div class="feature-card">
        <div class="feature-icon">👤</div>
        <h3>User Registration</h3>
        <p>Create a customer account to track orders and manage your profile.</p>
        <a href="<?= BASE_URL ?>/register.php">Register →</a>
    </div>
    <div class="feature-card">
        <div class="feature-icon">🔐</div>
        <h3>Secure Login</h3>
        <p>Login with email and password. Sessions are protected with PHP security best practices.</p>
        <a href="<?= BASE_URL ?>/login.php">Login →</a>
    </div>
    <div class="feature-card">
        <div class="feature-icon">🛡️</div>
        <h3>Admin & Staff Portal</h3>
        <p>Admin, Staff, and Product Manager roles with separate dashboards.</p>
        <a href="<?= BASE_URL ?>/admin/login.php">Admin Login →</a>
    </div>
</section>

<section class="roles-section container">
    <h2>Role-Based Access</h2>
    <div class="roles-grid">
        <div class="role-badge role-admin">
            <strong>Admin</strong>
            <span>Full system control, users, settings, reports</span>
        </div>
        <div class="role-badge role-staff">
            <strong>Staff</strong>
            <span>Orders, customer support, inventory view</span>
        </div>
        <div class="role-badge role-pm">
            <strong>Product Manager</strong>
            <span>Products, categories, pricing, campaigns</span>
        </div>
        <div class="role-badge role-user">
            <strong>Customer</strong>
            <span>Shop, orders, profile management</span>
        </div>
    </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
