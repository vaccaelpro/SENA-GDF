<?php

session_start();

function require_auth_or_404() {
    if (!isset($_SESSION['id_usuario']) || empty($_SESSION['id_usuario'])) {
        header("HTTP/1.0 404 Not Found");
        ?>
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Página no encontrada</title>
            <link rel="stylesheet" href="css/error404.css">
        </head>
        <body>
            <div class="container">
                <h1>404</h1>
                <p>Página no encontrada</p>
                <p class="subtitle">Lo sentimos, la página que buscas no existe.</p>
                <a href="login.php">Volver al inicio</a>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}

function require_role_or_404($allowed_roles) {
    require_auth_or_404();
    
    if (!is_array($allowed_roles)) {
        $allowed_roles = [$allowed_roles];
    }
    
    $user_role = $_SESSION['rol'] ?? null;
    
    if (!in_array($user_role, $allowed_roles)) {
        header("HTTP/1.0 404 Not Found");
        ?>
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Página no encontrada</title>
            <link rel="stylesheet" href="css/error404.css">
        </head>
        <body>
            <div class="container">
                <h1>404</h1>
                <p>Página no encontrada</p>
                <p class="subtitle">Lo sentimos, la página que buscas no existe.</p>
                <a href="login.php">Volver al inicio</a>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}

function current_user_info() {
    if (!isset($_SESSION['id_usuario'])) {
        return null;
    }
    
    return [
        'id' => $_SESSION['id_usuario'],
        'rol' => $_SESSION['rol'] ?? null,
        'nombre_completo' => ($_SESSION['primer_nombre'] ?? '') . ' ' . ($_SESSION['primer_apellido'] ?? ''),
        'primer_nombre' => $_SESSION['primer_nombre'] ?? null,
        'primer_apellido' => $_SESSION['primer_apellido'] ?? null,
    ];
}
