<?php
require_once 'config/auth_protect.php';
require_role_or_404('ADMIN');

include("config/db.php");

$nombre = $_SESSION['primer_nombre'] . " " . $_SESSION['primer_apellido'];

$sql = "SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, tipo_documento, documento, grupo_formacion, correo_electronico, tipo_apoyo, rol FROM Usuario WHERE rol != 'ADMIN' ORDER BY primer_nombre ASC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exportación de Datos Personales</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="css/exportacion_personal.css">
</head>
<body>

<div class="sidebar d-flex flex-column p-3">
  <div class="text-center mb-4">
    <img src="img/logosena2.png" alt="SENA" class="img-fluid mb-2 logo-sena">
    <h5 class="titulo">SENA GDF</h5>
    <p>Administrador</p>
  </div>
  <hr>
  <div class="flex-grow-1 d-flex flex-column justify-content-center">
    <div class="menu-item">
      <a href="#"><i class="bi bi-newspaper"></i> Novedades</a>
      <div class="submenu">
        <a href="nueva_novedad.php"> Agregar Novedades</a>
        <a href="eliminar_novedades.php"> Eliminar Novedades</a>
      </div>
    </div>
    <div class="menu-item">
      <a href="gestiondeusuarios.php"><i class="bi bi-person-fill-gear"></i> Gestión de Usuario</a>
    </div>
    <div class="menu-item">
      <a href="#"><i class="bi bi-download"></i> Exportación de Datos</a>
      <div class="submenu">
        <a href="exportar_finanzas.php"> Finanzas</a>
        <a href="exportar_personal.php"> Personal</a>
      </div>
    </div>
    <div class="menu-item">
      <a href="#"><i class="bi bi-chat-right-text-fill"></i> Encuestas y Análisis</a>
      <div class="submenu">
        <a href="encuestas.php"> Encuestas</a>
        <a href="analisis.php"> Análisis</a>
      </div>
    </div>
    <div class="menu-item">
      <a href="lista_grupos.php"><i class="bi bi-people-fill"></i> Grupos</a>
    </div>
  </div>
  <div class="bottom-links mt-auto">
    <hr>
    <a href="#"><i class="bi bi-gear-fill"></i> Ajustes</a>
    <a href="cerrar_sesio.php" class="cerrar"><i class="bi bi-box-arrow-left"></i> Cerrar Sesión</a>
  </div>
</div>

<div class="main-content">
    <div class="text-white p-4 d-flex justify-content-between align-items-center header-fixed" id="header">
        <div>
            <h5 class="titulo">Bienvenida, <?= $nombre ?></h5>
            <p>Mantente al día en la administración de tus ingresos</p>
        </div>
        <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2" style="font-size: 1.5rem;"></i>
            <span><?= $nombre ?></span>&nbsp;
            <i class="bi bi-caret-down-fill"></i>
            <span class="ms-3" id="clock"></span>
        </div>
    </div>
  
  <div class="contenido p-4">
    <h2 class="titulo-seccion">Exportación de Datos Personales</h2>
    <p class="subtitulo">Descarga los datos personales de los usuarios en formato Excel.</p>

    <div class="d-flex gap-2 mb-4 justify-content-end">
      <a href="exportar_personal_excel.php" class="btn btn-success px-4">
        <i class="bi bi-download"></i> Exportar
      </a>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle custom-table" id="tablaUsuarios">
        <thead>
          <tr>
            <th>Primer Nombre</th>
            <th>Segundo Nombre</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>Tipo Documento</th>
            <th>Documento</th>
            <th>Grupo Formación</th>
            <th>Correo Electrónico</th>
            <th>Tipo de Apoyo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
    <?php if($result->num_rows > 0): ?>
        <?php while($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['primer_nombre']) ?></td>
                <td><?= htmlspecialchars($row['segundo_nombre']) ?></td>
                <td><?= htmlspecialchars($row['primer_apellido']) ?></td>
                <td><?= htmlspecialchars($row['segundo_apellido']) ?></td>
                <td><?= htmlspecialchars($row['tipo_documento']) ?></td>
                <td><?= htmlspecialchars($row['documento']) ?></td>
                <td><?= htmlspecialchars($row['grupo_formacion']) ?></td>
                <td><?= htmlspecialchars($row['correo_electronico']) ?></td>
                <td><?= htmlspecialchars($row['tipo_apoyo']) ?></td>
                <td><?= htmlspecialchars($row['rol']) ?></td>
            </tr>
        <?php endwhile; ?>
    <?php else: ?>
        <tr>
            <td colspan="10">No hay usuarios registrados</td>
        </tr>
    <?php endif; ?>
</tbody>

      </table>
    </div>
  </div>
</div>

<script>
  function updateClock(){
    const now = new Date();
    const clock = document.getElementById("clock");
    clock.textContent = now.toLocaleTimeString();
  }
  setInterval(updateClock, 1000);
  updateClock();
</script>
<script src="js/session_timeout.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

