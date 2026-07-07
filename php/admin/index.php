<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

requireLogin();

if (hasRole('admin')) {
    header('Location: ' . BASE_URL . '/admin/dashboard.php');
} elseif (hasRole('staff')) {
    header('Location: ' . BASE_URL . '/admin/staff-dashboard.php');
} elseif (hasRole('product_manager')) {
    header('Location: ' . BASE_URL . '/admin/product-manager.php');
} else {
    header('Location: ' . BASE_URL . '/user/dashboard.php');
}
exit;
