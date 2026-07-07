<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

if (isLoggedIn()) {
    redirectByRole(currentUser()['role']);
}

include __DIR__ . '/includes/login-form.php';
