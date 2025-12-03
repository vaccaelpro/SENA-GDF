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
            $mensaje = "<div class='alert alert-success text-center'>
                Se ha enviado un correo de recuperación a <b>$correo</b>.<br>
                Revisa tu bandeja de entrada o carpeta de spam.
            </div>";
        } else {
            $mensaje = "<div class='alert alert-danger text-center'>
                 Error al enviar el correo. Intenta de nuevo.
            </div>";
        }
    } else {
        $mensaje = "<div class='alert alert-warning text-center'>
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
</head>
<body class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="p-5 rounded-4 bg-white shadow text-center" style="width:400px;">
        <h4 class="mb-3 fw-bold">¿Olvidaste tu contraseña?</h4>
        <p class="text-muted mb-4">Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.</p>

        <?php if (!empty($mensaje)) echo $mensaje; ?>

        <form method="POST" action="recuperarpass1.php">
            <input type="email" name="correo" class="form-control mb-3" placeholder="email@ejemplo.com" required>
            <button type="submit" class="btn btn-dark w-100 fw-bold">Restablecer Contraseña</button>
        </form>

        <a href="login.php" class="d-block mt-4 text-success text-decoration-underline">← Volver al inicio de sesión</a>
    </div>
</body>
</html>
