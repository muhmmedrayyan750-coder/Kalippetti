<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
requireRole('staff', 'admin');

$user = currentUser();
$pageTitle = 'Staff Dashboard — ' . APP_NAME;
$bodyClass = 'page-dashboard staff-theme';
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/admin-sidebar.php';
?>

<section class="dashboard-main">
    <div class="dashboard-top">
        <div>
            <h1>Staff Dashboard</h1>
            <p class="dashboard-desc">Orders, customer support, and daily operations</p>
        </div>
        <span class="role-tag role-staff-tag">Staff</span>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-icon">📋</span>
            <div><strong>0</strong><span>Pending Orders</span></div>
        </div>
        <div class="stat-card">
            <span class="stat-icon">✅</span>
            <div><strong>0</strong><span>Completed Today</span></div>
        </div>
        <div class="stat-card">
            <span class="stat-icon">💬</span>
            <div><strong>0</strong><span>Support Tickets</span></div>
        </div>
    </div>

    <div class="panel-grid">
        <div class="panel">
            <h3>Staff Responsibilities</h3>
            <ul class="action-list">
                <li>Process and ship customer orders</li>
                <li>Handle customer inquiries and support</li>
                <li>Update order status (Pending → Shipped → Delivered)</li>
                <li>View inventory levels (read-only)</li>
            </ul>
        </div>
        <div class="panel">
            <h3>Order Queue</h3>
            <p class="text-muted">Connect to your shop database to display live orders here.</p>
        </div>
    </div>
</section>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
