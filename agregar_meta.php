<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crear Meta</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="css/agregar_meta.css">
</head>
<body>

<div class="sidebar d-flex flex-column p-3">
  <div class="text-center mb-4">
    <img src="img/logosena2.png" alt="SENA" class="img-fluid mb-2" id="logosena2">
    <h5 class="titulo">SENA GDF</h5>
    <p>Aprendiz</p>
  </div>
  <hr>

  <div class="menu-container flex-grow-1 d-flex flex-column justify-content-center">
    <div class="menu-item">
      <a href="novedades_aprendiz.html"><i class="bi bi-newspaper" id="icn">&nbsp;</i>Novedades</a>
    </div>
    <div class="menu-item">
      <a href="IAFinace.html"><i class="bi bi-robot" id="icn">&nbsp;</i>IA Finance</a>
    </div>
    <div class="menu-item">
      <a href="#"><i class="bi bi-piggy-bank-fill" id="icn">&nbsp;</i>Metas De Ahorro</a>
    </div>
    <div class="menu-item">
      <a href="IADocumen.html"><i class="bi bi-robot" id="icn">&nbsp;</i>IA Guía Formularios</a>
    </div>
  </div>

  <div class="bottom-links mt-auto">
    <hr>
    <a href="#"><i class="bi bi-gear-fill" id="icn"></i>&nbsp;Ajustes</a>
    <a href="login.html"><i class="bi bi-box-arrow-left" id="icn"></i> &nbsp;Cerrar Sesión</a>
  </div>
</div>

<div class="text-white p-4 d-flex justify-content-between align-items-center header-fixed" id="header">
  <div>
    <h5 class="titulo">Bienvenido, Santiago Vacca</h5>
    <p>Mantente al día en la administración de tus ingresos</p>
  </div>
  <div class="d-flex align-items-center">
    <i class="bi bi-person-circle me-2" style="font-size: 1.5rem;"></i>
    <span>Santiago Vacca</span>&nbsp;
    <i class="bi bi-caret-down-fill"></i>
    <span class="ms-3" id="clock"></span>
  </div>
</div>

<div class="main-content">
  <section class="formulario-meta">
    <h2>Crear meta de ahorro</h2>
    <div class="formulario">
      <label>Nombre del ahorro:</label>
      <input type="text" placeholder="Ingresar Nombre">

      <label>Descripción del ahorro:</label>
      <textarea placeholder="Ingresar descripción"></textarea>

      <label>Monto inicial del ahorro:</label>
      <input type="number" placeholder="Ingresar monto">

      <a href="metas _de _ahorro.html">
        <button class="btn-crear">Crear</button>
      </a>
    </div>
  </section>
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

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
