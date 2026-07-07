<?php

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('APP_NAME', 'Kalippetti');
define('BASE_URL', '/php');

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/../includes/auth.php';
