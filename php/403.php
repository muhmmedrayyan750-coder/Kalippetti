<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

http_response_code(403);
$pageTitle = 'Access Denied — ' . APP_NAME;
$bodyClass = 'page-auth';
include __DIR__ . '/includes/header.php';
?>

<div class="auth-container">
    <div class="auth-card text-center">
        <div class="error-code">403</div>
        <h1>Access Denied</h1>
        <p class="auth-subtitle">You don't have permission to view this page.</p>
        <a href="<?= BASE_URL ?>/index.php" class="btn btn-primary">Go Home</a>
    </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>
