<?php
require_once 'config/auth_protect.php';
require_role_or_404('ADMIN');

$nombre = $_SESSION['primer_nombre'] . " " . $_SESSION['primer_apellido'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crear Encuesta</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="css/encuestas.css">
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
      <a href="exportacion_de_datos.php"><i class="bi bi-download"></i> Exportación de Datos</a>
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

  <div class="contenido p-5">
    <div class="card encuesta-card shadow">
      <h2 class="mb-4">Crear Encuesta</h2>
      <form>
        <div class="mb-3">
          <label class="form-label fw-bold">Título de Encuesta</label>
          <input type="text" class="form-control custom-input" placeholder="Ingresa tu título aquí">
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Descripción</label>
          <textarea class="form-control custom-input" rows="2" placeholder="Ingresa la descripción aquí"></textarea>
        </div>

        <div id="preguntas-container">
          <div class="pregunta-box mb-3 p-3 border rounded">
            <label class="form-label fw-bold">Pregunta 1</label>
            <input type="text" class="form-control custom-input mb-2" placeholder="Ingresa la pregunta aquí">
            <label class="form-label">Respuesta</label>
            <input type="text" class="form-control custom-input" placeholder="Placeholder">
          </div>
        </div>

        <button type="button" class="btn btn-outline-success mb-3" id="agregarPregunta">
          <i class="bi bi-plus-circle"></i> Agregar Pregunta
        </button>

        <button type="submit" class="btn btn-success w-100">Crear</button>
      </form>
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

  document.getElementById("agregarPregunta").addEventListener("click", () => {
    const container = document.getElementById("preguntas-container");
    const index = container.children.length + 1;
    const div = document.createElement("div");
    div.classList.add("pregunta-box","mb-3","p-3","border","rounded");
    div.innerHTML = `
      <label class="form-label fw-bold">Pregunta ${index}</label>
      <input type="text" class="form-control custom-input mb-2" placeholder="Ingresa la pregunta aquí">
      <label class="form-label">Respuesta</label>
      <input type="text" class="form-control custom-input" placeholder="Placeholder">
    `;
    container.appendChild(div);
  });
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
