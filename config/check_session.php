<?php
session_start();

header('Content-Type: application/json');

define('SESSION_TIMEOUT', 180);

$response = ['active' => false];

if (isset($_SESSION['id_usuario'])) {
    if (isset($_SESSION['last_activity'])) {
        $inactive_time = time() - $_SESSION['last_activity'];
        
        if ($inactive_time <= SESSION_TIMEOUT) {
            $response['active'] = true;
            $response['remaining'] = SESSION_TIMEOUT - $inactive_time;
        } else {
            session_unset();
            session_destroy();
        }
    } else {
        $_SESSION['last_activity'] = time();
        $response['active'] = true;
        $response['remaining'] = SESSION_TIMEOUT;
    }
} else {
    $response['active'] = false;
}

echo json_encode($response);
exit;
