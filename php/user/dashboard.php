<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
requireRole('user');

$user = currentUser();
$pageTitle = 'My Account — ' . APP_NAME;
$bodyClass = 'page-dashboard';
include __DIR__ . '/../includes/header.php';
?>

<div class="container dashboard">
    <aside class="sidebar">
        <div class="sidebar-header">
            <span class="role-tag role-user-tag">Customer</span>
            <h2><?= e($user['full_name']) ?></h2>
            <p><?= e($user['email']) ?></p>
        </div>
        <nav class="sidebar-nav">
            <a href="#" class="active">Dashboard</a>
            <a href="#">My Orders</a>
            <a href="#">Profile Settings</a>
            <a href="<?= BASE_URL ?>/logout.php">Logout</a>
        </nav>
    </aside>

    <section class="dashboard-main">
        <h1>Welcome, <?= e(explode(' ', $user['full_name'])[0]) ?>! 👋</h1>
        <p class="dashboard-desc">Manage your account and track your toy orders.</p>

        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-icon">📦</span>
                <div>
                    <strong>0</strong>
                    <span>Total Orders</span>
                </div>
            </div>
            <div class="stat-card">
                <span class="stat-icon">❤️</span>
                <div>
                    <strong>0</strong>
                    <span>Wishlist Items</span>
                </div>
            </div>
            <div class="stat-card">
                <span class="stat-icon">📅</span>
                <div>
                    <strong><?= e(date('M j, Y', strtotime($user['created_at']))) ?></strong>
                    <span>Member Since</span>
                </div>
            </div>
        </div>

        <div class="panel">
            <h3>Recent Activity</h3>
            <p class="text-muted">No orders yet. Start shopping at Kalippetti!</p>
            <a href="/" class="btn btn-primary">Browse Shop</a>
        </div>
    </section>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
