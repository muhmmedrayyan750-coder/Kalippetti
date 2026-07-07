<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

logoutUser();
header('Location: ' . BASE_URL . '/login.php');
exit;
