<?php
include("config/db.php");
include("config/mail_config.php");

$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['correo'];

    $sql = "SELECT id_usuario FROM Usuario WHERE correo_electronico = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $usuario = $resultado->fetch_assoc();
        $usuario_id = $usuario['id_usuario'];

        $token = bin2hex(random_bytes(50));
        $fecha_solicitud = date("Y-m-d H:i:s");

        $insert = $conn->prepare("INSERT INTO recuperacion_contrasena (token, fecha_solicitud, usuario_id_usuario) VALUES (?, ?, ?)");
        $insert->bind_param("ssi", $token, $fecha_solicitud, $usuario_id);
        $insert->execute();

        if (enviarCorreoRecuperacion($correo, $token)) {
            $mensaje = "<div class='alert alert-success'>
                Se ha enviado un correo de recuperación a <b>$correo</b>.<br>
                Revisa tu bandeja de entrada o carpeta de spam.
            </div>";
        } else {
            $mensaje = "<div class='alert alert-danger'>
                 Error al enviar el correo. Intenta de nuevo.
            </div>";
        }
    } else {
        $mensaje = "<div class='alert alert-warning'>
             El correo ingresado no está registrado.
        </div>";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperar Contraseña</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/login.css">
</head>
<body class="d-flex justify-content-center align-items-center vh-100">
  <div class="login-container">
    <div class="left-login text-center">
      <p class="titulo">¿Ya recordaste?</p>
      <p class="texto">Vuelve al inicio de sesión</p>
      <a href="login.php"><button type="button" class="btn btn-light btn-custom">Iniciar Sesión</button></a>
    </div>

    <div class="right-login text-center">
      <img src="img/logosena2.png" alt="logo-sena" class="logosena mb-3">
      <div class="fw-bold sena-title">RECUPERAR CONTRASEÑA</div>
      <div class="sena-subtitle mb-3">Ingresa tu correo electrónico y te enviaremos un enlace</div>

      <?php if (!empty($mensaje)) echo $mensaje; ?>

      <form action="recuperarpass1.php" method="POST">
        <input type="email" name="correo" class="form-control custom-input mb-3" placeholder="email@ejemplo.com" required>
        <button type="submit" class="btn btn-login w-100">Enviar Enlace de Recuperación</button>
      </form>

      <a href="login.php" class="doc-link mt-3">← Volver al inicio de sesión</a>
    </div>
  </div>
</body>
</html>
