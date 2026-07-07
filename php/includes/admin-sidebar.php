<?php
/** Admin sidebar — included inside .dashboard wrapper */
$user = currentUser();
$role = $user['role'] ?? 'user';
?>
<div class="container dashboard">
    <aside class="sidebar admin-sidebar">
        <div class="sidebar-header">
            <span class="role-tag role-<?= e(str_replace('_', '-', $role)) ?>-tag"><?= e(ROLE_LABELS[$role] ?? $role) ?></span>
            <h2><?= e($user['full_name']) ?></h2>
            <p><?= e($user['email']) ?></p>
        </div>
        <nav class="sidebar-nav">
            <?php if (hasRole('admin')): ?>
                <a href="<?= BASE_URL ?>/admin/dashboard.php" class="<?= str_contains($_SERVER['PHP_SELF'], 'dashboard.php') && !str_contains($_SERVER['PHP_SELF'], 'staff') ? 'active' : '' ?>">Admin Dashboard</a>
            <?php endif; ?>
            <?php if (hasRole('admin', 'staff')): ?>
                <a href="<?= BASE_URL ?>/admin/staff-dashboard.php" class="<?= str_contains($_SERVER['PHP_SELF'], 'staff-dashboard') ? 'active' : '' ?>">Staff Panel</a>
            <?php endif; ?>
            <?php if (hasRole('admin', 'product_manager')): ?>
                <a href="<?= BASE_URL ?>/admin/product-manager.php" class="<?= str_contains($_SERVER['PHP_SELF'], 'product-manager') ? 'active' : '' ?>">Product Manager</a>
            <?php endif; ?>
            <a href="<?= BASE_URL ?>/">← Back to Site</a>
            <a href="<?= BASE_URL ?>/logout.php">Logout</a>
        </nav>
    </aside>
