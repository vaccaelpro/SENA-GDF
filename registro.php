<?php
include("config/db.php");
$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $primer_nombre   = $_POST['primer_nombre'];
    $segundo_nombre  = $_POST['segundo_nombre'];
    $primer_apellido = $_POST['primer_apellido'];
    $segundo_apellido= $_POST['segundo_apellido'];
    $tipo_documento  = $_POST['tipo_documento'];
    $documento       = $_POST['documento'];
    $correo          = $_POST['correo'];
    $contrasena      = $_POST['contrasena'];
    $grupo_formacion = $_POST['grupo_formacion'];

    $hash = password_hash($contrasena, PASSWORD_DEFAULT);

    $rol = "USUARIO";

    $sql = "INSERT INTO Usuario (
                primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                tipo_documento, documento, grupo_formacion,
                correo_electronico, contrasena, rol, fecha_registro, ultima_actualizacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "sssssissss", 
        $primer_nombre, $segundo_nombre, $primer_apellido, $segundo_apellido,
        $tipo_documento, $documento, $grupo_formacion,
        $correo, $hash, $rol
    );

    if ($stmt->execute()) {
        $mensaje = "Usuario registrado correctamente. Ya puedes iniciar sesión.";
    } else {
        $mensaje = "Error: " . $stmt->error;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/registro.css">
</head>
<body class="vh-100 d-flex align-items-center justify-content-center">
  <div class="registro-container">
    <div class="row g-0 h-100">
      <div class="col-md-4 left-panel text-center">
        <img src="img/logosena.png" class="logosena mb-3">
        <h4 class="titulo">¿Ya tienes una cuenta?</h4>
        <p class="texto">Inicia sesión aquí</p>
        <a href="login.php"><button type="button" class="btn btn-light btn-custom">Iniciar Sesión</button></a>
      </div>
      <div class="col-md-8 right-panel">
        <h4 class="mb-4 titulo">Crea Tu Cuenta</h4>

        <?php if (!empty($mensaje)) { ?>
          <div class="alert alert-info"><?= $mensaje ?></div>
        <?php } ?>

        <form method="POST" action="registro.php">
          <div class="row mb-3">
            <div class="col"><input type="text" name="primer_nombre" class="form-control custom-input" placeholder="Primer Nombre" required></div>
            <div class="col"><input type="text" name="segundo_nombre" class="form-control custom-input" placeholder="Segundo Nombre"></div>
          </div>
          <div class="row mb-3">
            <div class="col"><input type="text" name="primer_apellido" class="form-control custom-input" placeholder="Primer Apellido" required></div>
            <div class="col"><input type="text" name="segundo_apellido" class="form-control custom-input" placeholder="Segundo Apellido"></div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <select name="tipo_documento" class="form-select custom-input" required>
                <option disabled selected>Tipo de Documento</option>
                <option value="CC">Cédula</option>
                <option value="TI">Tarjeta de Identidad</option>
              </select>
            </div>
            <div class="col"><input type="text" name="documento" class="form-control custom-input" placeholder="N° de Documento" required></div>
          </div>
          <div class="mb-3">
            <input type="email" name="correo" class="form-control custom-input" placeholder="Correo Electrónico" required>
          </div>
          <div class="mb-3">
            <input type="password" name="contrasena" class="form-control custom-input" placeholder="Contraseña" required>
          </div>
          <div class="row mb-3">
            <div class="col">
              <input type="text" name="grupo_formacion" class="form-control custom-input" placeholder="N° de Ficha (Grupo de Formación)" required>
            </div>
          </div>
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox">
            <label class="form-check-label">Quiero recibir notificaciones de esta plataforma.</label>
          </div>
          <button type="submit" class="btn btn-login w-100">Registrar</button>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
