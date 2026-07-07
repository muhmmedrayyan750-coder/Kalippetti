<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
requireRole('product_manager', 'admin');

$user = currentUser();
$pageTitle = 'Product Manager — ' . APP_NAME;
$bodyClass = 'page-dashboard pm-theme';
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/admin-sidebar.php';
?>

<section class="dashboard-main">
    <div class="dashboard-top">
        <div>
            <h1>Product Manager</h1>
            <p class="dashboard-desc">Manage products, categories, pricing, and campaigns</p>
        </div>
        <span class="role-tag role-pm-tag">Product Manager</span>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-icon">🧸</span>
            <div><strong>—</strong><span>Total Products</span></div>
        </div>
        <div class="stat-card">
            <span class="stat-icon">🏷️</span>
            <div><strong>—</strong><span>Categories</span></div>
        </div>
        <div class="stat-card">
            <span class="stat-icon">📢</span>
            <div><strong>—</strong><span>Active Campaigns</span></div>
        </div>
        <div class="stat-card">
            <span class="stat-icon">⚠️</span>
            <div><strong>—</strong><span>Low Stock Items</span></div>
        </div>
    </div>

    <div class="panel-grid">
        <div class="panel">
            <h3>Product Management</h3>
            <ul class="action-list">
                <li>Add, edit, and delete products</li>
                <li>Manage categories and tags</li>
                <li>Set prices, discounts, and stock levels</li>
                <li>Create promotional campaigns and ads</li>
            </ul>
            <a href="/" class="btn btn-primary" style="margin-top:1rem">Open React Admin Panel</a>
        </div>
        <div class="panel">
            <h3>Quick Actions</h3>
            <div class="quick-links">
                <button class="btn btn-outline" disabled>+ Add Product</button>
                <button class="btn btn-outline" disabled>Manage Categories</button>
                <button class="btn btn-outline" disabled>New Campaign</button>
            </div>
            <p class="text-muted" style="margin-top:1rem;font-size:0.85rem">Wire these buttons to your product API or React admin panel.</p>
        </div>
    </div>
</section>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
