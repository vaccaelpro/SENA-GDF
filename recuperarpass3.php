<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Contraseña</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="css/login.css">
</head>
<body class="d-flex justify-content-center align-items-center vh-100">
  <div class="login-container">
    <div class="left-login text-center">
      <p class="titulo">Nueva Contraseña</p>
      <p class="texto">Crea una contraseña segura diferente a la anterior</p>
      <div class="text-start" style="font-size: 0.85rem;">
        <p class="mb-1">✓ Mínimo 8 caracteres</p>
        <p class="mb-1">✓ Al menos una mayúscula</p>
        <p class="mb-0">✓ Al menos un número</p>
      </div>
    </div>

    <div class="right-login text-center">
      <img src="img/logosena2.png" alt="logo-sena" class="logosena mb-3">
      <div class="fw-bold sena-title">RESTABLECER CONTRASEÑA</div>
      <div class="sena-subtitle mb-4">Ingresa tu nueva contraseña</div>

      <form action="" method="POST">
        <div class="mb-3 text-start">
          <label class="form-label text-white">Nueva Contraseña</label>
          <div class="input-group">
            <span class="input-group-text bg-white"><i class="bi bi-lock-fill text-success"></i></span>
            <input type="password" name="nueva_contraseña" id="nueva_contraseña" class="form-control custom-input" placeholder="Ingresa tu nueva contraseña" required>
          </div>
        </div>

        <div class="mb-4 text-start">
          <label class="form-label text-white">Confirmar Contraseña</label>
          <div class="input-group">
            <span class="input-group-text bg-white"><i class="bi bi-lock-fill text-success"></i></span>
            <input type="password" name="confirmar_contraseña" id="confirmar_contraseña" class="form-control custom-input" placeholder="Confirma tu contraseña" required>
          </div>
        </div>

        <button type="submit" class="btn btn-login w-100">Restablecer Contraseña</button>
      </form>

      <a href="login.php" class="doc-link mt-3">← Volver al inicio de sesión</a>
    </div>
  </div>

  <script>
    // Validación de contraseñas
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
      const nueva = document.getElementById('nueva_contraseña').value;
      const confirmar = document.getElementById('confirmar_contraseña').value;
      
      if (nueva !== confirmar) {
        e.preventDefault();
        alert('Las contraseñas no coinciden');
      } else if (nueva.length < 8) {
        e.preventDefault();
        alert('La contraseña debe tener al menos 8 caracteres');
      }
    });
  </script>
</body>
</html>
