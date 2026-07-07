<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($pageTitle ?? APP_NAME) ?></title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/style.css">
</head>
<body class="<?= e($bodyClass ?? '') ?>">
    <nav class="navbar">
        <div class="container nav-inner">
            <a href="<?= BASE_URL ?>/index.php" class="logo">
                <span class="logo-kali">Kali</span><span class="logo-ppetti">ppetti</span>
            </a>
            <div class="nav-links">
                <a href="<?= BASE_URL ?>/index.php">Home</a>
                <?php if (isLoggedIn()): ?>
                    <?php $u = currentUser(); ?>
                    <span class="nav-user">Hi, <?= e($u['full_name'] ?? 'User') ?></span>
                    <?php if (hasRole('admin', 'staff', 'product_manager')): ?>
                        <a href="<?= BASE_URL ?>/admin/">Admin</a>
                    <?php endif; ?>
                    <a href="<?= BASE_URL ?>/user/dashboard.php">My Account</a>
                    <a href="<?= BASE_URL ?>/logout.php" class="btn btn-outline btn-sm">Logout</a>
                <?php else: ?>
                    <a href="<?= BASE_URL ?>/login.php">Login</a>
                    <a href="<?= BASE_URL ?>/register.php" class="btn btn-primary btn-sm">Register</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>
    <main class="main-content">
