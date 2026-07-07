<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
requireRole('admin');

$user = currentUser();
$db = getDB();

$totalUsers = (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();
$totalStaff = (int) $db->query("SELECT COUNT(*) FROM users WHERE role IN ('admin','staff','product_manager')")->fetchColumn();
$totalCustomers = (int) $db->query("SELECT COUNT(*) FROM users WHERE role = 'user'")->fetchColumn();

$pageTitle = 'Admin Dashboard — ' . APP_NAME;
$bodyClass = 'page-dashboard admin-theme';
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/admin-sidebar.php';
?>

<section class="dashboard-main">
    <div class="dashboard-top">
        <div>
            <h1>Admin Dashboard</h1>
            <p class="dashboard-desc">Full system overview and management</p>
        </div>
        <span class="role-tag role-admin-tag">Administrator</span>
    </div>

    <div class="stats-grid">
        <div class="stat-card stat-primary">
            <span class="stat-icon">👥</span>
            <div><strong><?= $totalUsers ?></strong><span>Total Users</span></div>
        </div>
        <div class="stat-card stat-success">
            <span class="stat-icon">🛒</span>
            <div><strong><?= $totalCustomers ?></strong><span>Customers</span></div>
        </div>
        <div class="stat-card stat-warning">
            <span class="stat-icon">🛡️</span>
            <div><strong><?= $totalStaff ?></strong><span>Staff & Admins</span></div>
        </div>
        <div class="stat-card stat-info">
            <span class="stat-icon">📦</span>
            <div><strong>—</strong><span>Orders (connect shop)</span></div>
        </div>
    </div>

    <div class="panel-grid">
        <div class="panel">
            <h3>Admin Controls</h3>
            <ul class="action-list">
                <li>✅ Manage all users and roles</li>
                <li>✅ Site settings & configuration</li>
                <li>✅ View reports and analytics</li>
                <li>✅ Access staff & product manager panels</li>
            </ul>
        </div>
        <div class="panel">
            <h3>Quick Links</h3>
            <div class="quick-links">
                <a href="<?= BASE_URL ?>/admin/staff-dashboard.php" class="btn btn-outline">Staff Panel</a>
                <a href="<?= BASE_URL ?>/admin/product-manager.php" class="btn btn-outline">Product Manager</a>
            </div>
        </div>
    </div>

    <div class="panel">
        <h3>All Users</h3>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                <?php
                $users = $db->query('SELECT full_name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 20')->fetchAll();
                foreach ($users as $u):
                ?>
                    <tr>
                        <td><?= e($u['full_name']) ?></td>
                        <td><?= e($u['email']) ?></td>
                        <td><span class="role-pill role-<?= e(str_replace('_', '-', $u['role'])) ?>"><?= e(ROLE_LABELS[$u['role']] ?? $u['role']) ?></span></td>
                        <td><?= e(date('M j, Y', strtotime($u['created_at']))) ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</section>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
