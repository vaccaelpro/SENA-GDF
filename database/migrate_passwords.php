<?php

/**
 * Script de migración de contraseñas
 * Convierte contraseñas en texto plano a password_hash()
 */

require_once __DIR__ . '/../config/db.php';

echo "=== Migración de Contraseñas ===\n\n";

// Obtener todos los usuarios
$sql = "SELECT id_usuario, documento, contrasena FROM Usuario";
$result = $conn->query($sql);

if (!$result) {
    die("Error al obtener usuarios: " . $conn->error . "\n");
}

$totalUsers = $result->num_rows;
$migrated = 0;
$skipped = 0;
$errors = 0;

echo "Total de usuarios encontrados: {$totalUsers}\n\n";

while ($user = $result->fetch_assoc()) {
    $id = $user['id_usuario'];
    $documento = $user['documento'];
    $password = $user['contrasena'];
    
    // Verificar si la contraseña ya está hasheada
    // Los hashes de password_hash comienzan con $2y$
    if (preg_match('/^\$2[ayb]\$/', $password)) {
        echo "Usuario {$documento}: Contraseña ya hasheada, omitiendo...\n";
        $skipped++;
        continue;
    }
    
    // Convertir a hash
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Actualizar en base de datos
    $updateSql = "UPDATE Usuario SET contrasena = ? WHERE id_usuario = ?";
    $stmt = $conn->prepare($updateSql);
    $stmt->bind_param("si", $hashedPassword, $id);
    
    if ($stmt->execute()) {
        echo "Usuario {$documento}: Contraseña migrada exitosamente\n";
        $migrated++;
    } else {
        echo "Usuario {$documento}: Error al migrar - " . $stmt->error . "\n";
        $errors++;
    }
    
    $stmt->close();
}

echo "\n=== Resumen de Migración ===\n";
echo "Total de usuarios: {$totalUsers}\n";
echo "Migrados: {$migrated}\n";
echo "Omitidos (ya hasheados): {$skipped}\n";
echo "Errores: {$errors}\n";
echo "\nMigración completada.\n";

$conn->close();
