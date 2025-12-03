<?php
require_once 'config/auth_protect.php';
require_auth_or_404();

$nombre = $_SESSION['primer_nombre'] . " " . $_SESSION['primer_apellido'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard IA Finance</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="css/IAfinance.css">
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
    <div class="menu-item"><a href="novedades_aprendiz.php"><i class="bi bi-newspaper"></i>&nbsp;Novedades</a></div>
    <div class="menu-item"><a href=""><i class="bi bi-robot"></i>&nbsp;IA Finance</a></div>
    <div class="menu-item"><a href="metas_de_ahorro.php"><i class="bi bi-piggy-bank-fill"></i>&nbsp;Metas De Ahorro</a></div>
    <div class="menu-item"><a href="IADocumen.php"><i class="bi bi-robot"></i>&nbsp;IA Guía Formularios</a></div>
    <div class="menu-item"><a href="mi_grupo.php"><i class="bi bi-people-fill"></i>&nbsp;Mi Grupo</a></div>
  </div>
  <div class="bottom-links mt-auto">
    <hr>
    <a href="#"><i class="bi bi-gear-fill"></i>&nbsp;Ajustes</a>
    <a href="cerrar_sesio.php" class="cerrar"><i class="bi bi-box-arrow-left"></i> Cerrar Sesión</a>
  </div>
</div>

<div class="text-white p-4 d-flex justify-content-between align-items-center header-fixed" id="header">
  <div>
    <h5 class="titulo">Bienvenido, <?= $nombre ?></h5>
    <p>Mantente al día en la administración de tus ingresos</p>
  </div>
  <div class="d-flex align-items-center">
    <i class="bi bi-person-circle me-2" style="font-size: 1.5rem;"></i>
    <span><?= $nombre ?></span>&nbsp;
    <i class="bi bi-caret-down-fill"></i>
    <span class="ms-3" id="clock"></span>
  </div>
</div>

<div class="main-content p-4">
  <div class="row g-4">
    <div class="col-lg-8">
      <div class="card ia-card">
        <div class="chat-messages p-3">
          <p><strong>Este es un espacio para el asistente IA Finance</strong></p>
          <p>Pregunta lo que necesites sobre finanzas.<br> El bot estará aquí para ayudarte :)</p>
        </div>
      </div>

      <div class="chat-input-wrapper mt-3">
        <div class="chat-box">
          <input type="text" class="chat-input" placeholder="Ingresa una pregunta para hablar">
          <button class="chat-btn"><i class="bi bi-send-fill"></i></button>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <div class="card meta-card p-3">
        <h6 class="fw-bold">Meta De Ahorro</h6>
        <p class="text-muted">Apoyo</p>
        <h5 class="fw-bold text-success">Dinero Ahorrado</h5>
        <h4 class="fw-bold">$950,500 COP</h4>
        <small class="text-muted">Dinero predispuesto para cada mes</small>
        <p class="fw-bold mt-2">$750,000 COP</p>
      </div>

      <div class="card presupuesto-card p-3 mt-4">
        <h6 class="fw-bold"><i class="bi bi-wallet2"></i> Mi Presupuesto</h6>
        <p class="text-muted">Ingresa y contabiliza tus ingresos y egresos de este mes</p>
      </div>

      <div class="card categorias-card p-3 mt-4">
        <h6 class="fw-bold">Categorías de Gastos</h6>
        <canvas id="gastosChart"></canvas>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  function updateClock(){
    const now = new Date();
    const clock = document.getElementById("clock");
    clock.textContent = now.toLocaleTimeString();
  }
  setInterval(updateClock, 1000);
  updateClock();

  const ctx = document.getElementById('gastosChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Transporte', 'Alimentación', 'Personal'],
      datasets: [{
        data: [225000, 150000, 80000],
        backgroundColor: ['#dc3545', '#28a745', '#0d6efd'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>



