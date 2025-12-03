<?php
session_start();
include("config/db.php");

$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (empty($_POST['tipo_documento'])) {
        $mensaje = "Debes seleccionar un tipo de documento.";
    } elseif (empty($_POST['documento'])) {
        $mensaje = "Debes ingresar tu número de documento.";
    } elseif (empty($_POST['contrasena'])) {
        $mensaje = "Debes ingresar tu contraseña.";
    } else {

        $tipo_documento = $_POST['tipo_documento'];
        $documento      = $_POST['documento'];
        $contrasena     = $_POST['contrasena'];

        $sql = "SELECT * FROM Usuario WHERE tipo_documento=? AND documento=? LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $tipo_documento, $documento);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {

            $passIngresada = $contrasena;
            $passGuardada  = $row['contrasena'];

            // Validar contraseña en texto plano o hash
            $esCorrecta = false;

            // 1. Coincide como texto plano (para admins antiguos)
            if ($passIngresada === $passGuardada) {
                $esCorrecta = true;
            }

            // 2. Coincide como hash (para usuarios con contraseña encriptada)
            if (password_verify($passIngresada, $passGuardada)) {
                $esCorrecta = true;
            }

            if ($esCorrecta) {

                // Guardar variables de sesión
                $_SESSION['id_usuario']      = $row['id_usuario'];
                $_SESSION['rol']             = $row['rol'];
                $_SESSION['primer_nombre']   = $row['primer_nombre'];
                $_SESSION['primer_apellido'] = $row['primer_apellido'];
                $_SESSION['last_activity']   = time(); // Timestamp para control de inactividad


                // Redirección por rol
                switch ($row['rol']) {
                    case "USUARIO":
                        header("Location: dashboard_aprendiz.php");
                        exit;
                    case "ADMIN":
                        header("Location: dashboard_administrador.php");
                        exit;
                    case "INSTRUCTOR":
                        header("Location: dashboard_instructor.php");
                        exit;
                    default:
                        $mensaje = "Rol no autorizado.";
                }

            } else {
                $mensaje = "Contraseña incorrecta.";
            }

        } else {
            $mensaje = "Usuario no encontrado.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/login.css">
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>
<body class="d-flex justify-content-center align-items-center vh-100">
  <div class="login-container">
    <div class="left-login text-center">
      <p class="titulo">¿No tienes cuenta?</p>
      <p class="texto">Crea una aquí</p>
      <a href="registro.php"><button type="button" class="btn btn-light btn-custom">Crear Cuenta</button></a>
    </div>

    <div class="right-login text-center">
      <img src="img/logosena2.png" alt="logo-sena" class="logosena mb-3">
      <div class="fw-bold sena-title">SENA GDF</div>
      <div class="sena-subtitle mb-3">Inicia sesión con tu documento y contraseña</div>

      <?php if (isset($_GET['timeout']) && $_GET['timeout'] == 1) { ?>
        <div class="alert alert-warning">
          <i class="bi bi-clock-history"></i> Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.
        </div>
      <?php } ?>

      <?php if (!empty($mensaje)) { ?>
        <div class="alert alert-danger"><?= $mensaje ?></div>
      <?php } ?>

      <form action="login.php" method="POST">
        <select name="tipo_documento" id="tipo_documento" class="form-select custom-input mb-3" required>
            <option value="" disabled selected hidden>Selecciona tu documento</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
        </select>

        <div class="input-group mb-3">
          <span class="input-group-text"><ion-icon name="person-circle"></ion-icon></span>
          <input type="text" name="documento" class="form-control custom-input" placeholder="Número de documento" required>
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text"><ion-icon name="lock-closed-outline"></ion-icon></span>
          <input type="password" name="contrasena" class="form-control custom-input" placeholder="Contraseña" required>
        </div>

        <a href="recuperarpass1.php" class="doc-link">¿Olvidaste tu contraseña?</a>

        <div class="mt-3">
          <button type="submit" class="btn btn-login w-100">Ingresar</button>
        </div>
      </form>
    </div>

  </div>
</body>
</html>

