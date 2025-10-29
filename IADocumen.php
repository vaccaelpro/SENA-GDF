<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IADocument</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="css/document.css">
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
      <a href="metas _de _ahorro.html"><i class="bi bi-piggy-bank-fill" id="icn">&nbsp;</i>Metas De Ahorro</a>
    </div>
    <div class="menu-item">
      <a href=""><i class="bi bi-robot" id="icn">&nbsp;</i>IA Guía Formularios</a>
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
  <div class="container p-4">
    <h2>¿Cómo aplicar a los beneficios de sostenimiento?</h2>
    <p>Los pasos para aplicar al beneficio de sostenimiento son los siguientes:</p>
    <ol>
      <li>Revisar los <strong>requisitos actualizados</strong> para ser beneficiario.</li>
      <li>Completar el formulario oficial del SENA.</li>
      <li>Enviar la solicitud y esperar la respuesta.</li>
    </ol>
    <a href="https://centrotgi.blogspot.com/" target="_blank" rel="noopener noreferrer" class="btn btn-success">
      Ir a Formularios Oficiales
    </a>
    <hr>
    <h4>Requisitos</h4>
    <ul>
      <li>Estar matriculado en un programa del SENA.</li>
      <li>No tener otro subsidio similar.</li>
      <li>Cumplir con la asistencia mínima requerida.</li>
    </ul>
  </div>
</div>

<div class="contenedor-bot">
  <div class="headerbot p-2">
    <h3 class="Titulo-bot">Bot Bienestar Aprendiz</h3>
  </div>
  <div class="chat-body">
    <p class="mensaje-bot">Hola, soy tu asistente. ¿En qué puedo ayudarte?</p>
  </div>
  <div class="input-area">
    <div class="input-group">
      <input type="text" class="form-control" placeholder="Escribe un mensaje">
      <button type="button" class="btn btn-success">Enviar</button>
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

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

