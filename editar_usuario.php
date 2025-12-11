<?php
require_once 'config/auth_protect.php';
require_role_or_404('ADMIN');

include("config/db.php");

if (!isset($_GET['documento'])) {
    header("Location: gestiondeusuarios.php");
    exit;
}

$documento = $_GET['documento'];

$sql = "SELECT * FROM Usuario WHERE documento=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $documento);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows == 0) {
    header("Location: gestiondeusuarios.php");
    exit;
}

$user = $result->fetch_assoc();
$mensaje = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $primer_nombre    = $_POST['primer_nombre'] ?? '';
    $segundo_nombre   = $_POST['segundo_nombre'] ?? '';
    $primer_apellido  = $_POST['primer_apellido'] ?? '';
    $segundo_apellido = $_POST['segundo_apellido'] ?? '';
    $tipo_documento   = $_POST['tipo_documento'] ?? '';
    $grupo_formacion  = $_POST['grupo_formacion'] ?? '';
    $correo           = $_POST['correo_electronico'] ?? '';
    $rol              = $_POST['rol'] ?? '';
    $tipo_apoyo       = $_POST['tipo_apoyo'] ?? 'regular';

    $sqlUpdate = "UPDATE Usuario 
                  SET primer_nombre=?, segundo_nombre=?, primer_apellido=?, segundo_apellido=?, 
                      tipo_documento=?, grupo_formacion=?, correo_electronico=?, rol=?, tipo_apoyo=? 
                  WHERE documento=?";

    $stmt = $conn->prepare($sqlUpdate);
    if (!$stmt) {
        $mensaje = "Error en prepare: " . $conn->error;
    } else {
        $stmt->bind_param(
            "sssssssssi",
            $primer_nombre,
            $segundo_nombre,
            $primer_apellido,
            $segundo_apellido,
            $tipo_documento,
            $grupo_formacion,
            $correo,
            $rol,
            $tipo_apoyo,
            $documento
        );

        if ($stmt->execute()) {
            header("Location: gestiondeusuarios.php");
            exit;
        } else {
            $mensaje = "Error al actualizar el usuario: " . $stmt->error;
        }
    }
    $sql = "SELECT * FROM Usuario WHERE documento=?";
    $stmtR = $conn->prepare($sql);
    $stmtR->bind_param("i", $documento);
    $stmtR->execute();
    $result = $stmtR->get_result();
    if ($result && $result->num_rows) {
        $user = $result->fetch_assoc();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Usuario</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/editarusuario.css">
</head>

<body class="vh-100 d-flex align-items-center justify-content-center bg-light">

    <div class="form-container">

        <h3 class="text-center mb-4">Editar Usuario</h3>

        <?php if ($mensaje) { ?>
            <div class="alert alert-info text-center"><?= htmlspecialchars($mensaje) ?></div>
        <?php } ?>

        <form method="POST" novalidate>

            <div class="row mb-3">
                <div class="col">
                    <input type="text" name="primer_nombre" class="form-control custom-input"
                        value="<?= htmlspecialchars($user['primer_nombre'] ?? '') ?>" required>
                </div>
                <div class="col">
                    <input type="text" name="segundo_nombre" class="form-control custom-input"
                        value="<?= htmlspecialchars($user['segundo_nombre'] ?? '') ?>">
                </div>
            </div>

            <div class="row mb-3">
                <div class="col">
                    <input type="text" name="primer_apellido" class="form-control custom-input"
                        value="<?= htmlspecialchars($user['primer_apellido'] ?? '') ?>" required>
                </div>
                <div class="col">
                    <input type="text" name="segundo_apellido" class="form-control custom-input"
                        value="<?= htmlspecialchars($user['segundo_apellido'] ?? '') ?>">
                </div>
            </div>

            <div class="row mb-3">
                <div class="col">
                    <select name="tipo_documento" class="form-select custom-input" required>
                        <option value="CC" <?= (isset($user['tipo_documento']) && $user['tipo_documento']=='CC')?'selected':'' ?>>Cédula</option>
                        <option value="TI" <?= (isset($user['tipo_documento']) && $user['tipo_documento']=='TI')?'selected':'' ?>>Tarjeta de Identidad</option>
                    </select>
                </div>
                <div class="col">
                    <input type="text" class="form-control custom-input" 
                        value="<?= htmlspecialchars($user['documento'] ?? '') ?>" disabled>
                </div>
            </div>

            <div class="mb-3">
                <input type="email" name="correo_electronico" class="form-control custom-input"
                    value="<?= htmlspecialchars($user['correo_electronico'] ?? '') ?>" required>
            </div>

            <div class="mb-3">
                <input type="text" name="grupo_formacion" class="form-control custom-input"
                    value="<?= htmlspecialchars($user['grupo_formacion'] ?? '') ?>" required>
            </div>

            <div class="mb-3">
                <select name="rol" class="form-select custom-input" required>
                    <option value="USUARIO" <?= (isset($user['rol']) && $user['rol']=='USUARIO')?'selected':'' ?>>USUARIO</option>
                    <option value="ADMIN" <?= (isset($user['rol']) && $user['rol']=='ADMIN')?'selected':'' ?>>ADMIN</option>
                    <option value="INSTRUCTOR" <?= (isset($user['rol']) && $user['rol']=='INSTRUCTOR')?'selected':'' ?>>INSTRUCTOR</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Tipo de Apoyo</label>
                <select name="tipo_apoyo" class="form-select custom-input" required>
                    <option value="regular" <?= (isset($user['tipo_apoyo']) && $user['tipo_apoyo']=='regular')?'selected':'' ?>>Regular</option>
                    <option value="alimentacion" <?= (isset($user['tipo_apoyo']) && $user['tipo_apoyo']=='alimentacion')?'selected':'' ?>>Alimentación</option>
                    <option value="transporte" <?= (isset($user['tipo_apoyo']) && $user['tipo_apoyo']=='transporte')?'selected':'' ?>>Transporte</option>
                </select>
            </div>

            <button type="submit" class="btn btn-login w-100">Actualizar</button>

            <a href="gestiondeusuarios.php" class="btn w-100 mt-2 btn-secondary">Cancelar</a>

        </form>
    </div>
<script src="js/session_timeout.js"></script>
</body>
</html>



