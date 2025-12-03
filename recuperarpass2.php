<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revisa tu Correo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="css/login.css">
</head>
<body class="d-flex justify-content-center align-items-center vh-100">
  <div class="login-container">
    <div class="left-login text-center">
      <p class="titulo">¿Problemas?</p>
      <p class="texto">Revisa tu carpeta de spam o intenta reenviar el correo</p>
      <a href="recuperarpass1.php"><button type="button" class="btn btn-light btn-custom">Reenviar Correo</button></a>
    </div>

    <div class="right-login text-center">
      <img src="img/logosena2.png" alt="logo-sena" class="logosena mb-3">
      <div class="fw-bold sena-title">REVISA TU CORREO</div>
      <div class="sena-subtitle mb-4">Hemos enviado un link a tu correo electrónico</div>

      <div class="alert alert-success mb-4">
        <i class="bi bi-envelope-check" style="font-size: 3rem;"></i>
        <p class="mt-3 mb-0">Sigue los pasos del correo para recuperar tu contraseña</p>
      </div>

      <p class="text-muted">
        ¿No recibiste ningún correo? Revisa en tu carpeta de spam o 
        <a href="recuperarpass1.php" class="text-success fw-bold">reenvía el correo</a>
      </p>

      <a href="login.php" class="btn btn-login w-100 mt-3">Volver al Inicio de Sesión</a>
    </div>
  </div>
</body>
</html>
