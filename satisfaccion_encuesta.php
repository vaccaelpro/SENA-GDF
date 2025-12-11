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
  <title>Satisfacción del Software</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="css/dasboard_aprendiz.css">
  
  <style>
    .main-content {
      margin-left: 16.666%;
      padding: 20px;
      margin-top: 130px;
    }
    
    .header-fixed {
      position: fixed;
      top: 0;
      left: 16.666%;
      width: 83.334%;
      z-index: 900;
      background: #28a745;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      height: auto;
      min-height: 80px;
    }

    .rating-options {
      display: flex;
      justify-content: space-between;
      max-width: 400px;
      margin-bottom: 10px;
    }
    
    .rating-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

    .rating-item input {
      margin-bottom: 5px;
      cursor: pointer;
    }

    .question-card {
      background: #fff;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      border-left: 5px solid #28a745;
    }

    .question-title {
      font-weight: bold;
      color: #333;
      margin-bottom: 15px;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        height: auto;
        position: relative;
      }
      .main-content {
        margin-left: 0;
      }
      .header-fixed {
        left: 0;
        width: 100%;
      }
    }
  </style>
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
      <a href="novedades_aprendiz.php"><i class="bi bi-newspaper" id="icn">&nbsp;</i>Novedades</a>
    </div>

    <div class="menu-item">
      <a href="satisfaccion_encuesta.php"><i class="bi bi-check2-square" id="icn">&nbsp;</i>Satisfacción Encuestas</a>
    </div>

    <div class="menu-item">
      <a href="IAFinace.php"><i class="bi bi-robot" id="icn">&nbsp;</i>IA Finance</a>
    </div>

    <div class="menu-item">
      <a href="metas_de_ahorro.php"><i class="bi bi-piggy-bank-fill" id="icn">&nbsp;</i>Metas De Ahorro</a>
    </div>

    <div class="menu-item">
      <a href="IADocumen.php"><i class="bi bi-robot" id="icn">&nbsp;</i>IA Guía Formularios</a>
    </div>

    <div class="menu-item">
      <a href="mi_grupo.php"><i class="bi bi-people-fill" id="icn">&nbsp;</i>Mi Grupo</a>
    </div>
  </div>

  <div class="bottom-links mt-auto">
    <hr>
    <a href="#"><i class="bi bi-gear-fill" id="icn"></i>&nbsp;Ajustes</a>
    <a href="cerrar_sesio.php" class="cerrar"><i class="bi bi-box-arrow-left"></i> Cerrar Sesión</a>
  </div>
</div>

<div class="text-white p-4 d-flex justify-content-between align-items-center header-fixed" id="header">
  <div>
    <h5 class="titulo">Bienvenida, <?= $nombre ?></h5>
    <p>Evalúa nuestro software SENA GDF</p>
  </div>
  <div class="d-flex align-items-center">
    <i class="bi bi-person-circle me-2" style="font-size: 1.5rem;"></i>
    <span><?= $nombre ?></span>&nbsp;
    <i class="bi bi-caret-down-fill"></i>
    <span class="ms-3" id="clock"></span>
  </div>
</div>

<div class="main-content">
  <div class="container">
    <h2 class="mb-4 text-center text-success fw-bold">Encuesta de Satisfacción del Software</h2>
    <p class="text-center mb-5 text-muted">Por favor califica del 1 al 10 los siguientes aspectos de la plataforma y déjanos tus comentarios.</p>
    
    <form action="#" method="POST">

      <div class="question-card">
        <h5 class="question-title">1. ¿Qué tan fácil de usar te parece el software SENA GDF?</h5>
        <div class="mb-3">
          <label class="form-label text-muted">Calificación (1 = Muy difícil, 10 = Muy fácil)</label>
          <div class="rating-options">
            <?php for($i=1; $i<=10; $i++): ?>
              <div class="rating-item">
                <input type="radio" name="p1_rating" value="<?= $i ?>" required>
                <small><?= $i ?></small>
              </div>
            <?php endfor; ?>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Comentarios adicionales:</label>
          <textarea class="form-control" name="p1_text" rows="2" placeholder="¿Por qué elegiste esa calificación?"></textarea>
        </div>
      </div>

      <div class="question-card">
        <h5 class="question-title">2. ¿Cómo calificarías el diseño visual y los colores de la aplicación?</h5>
        <div class="mb-3">
          <label class="form-label text-muted">Calificación (1 = No me gusta, 10 = Me encanta)</label>
          <div class="rating-options">
            <?php for($i=1; $i<=10; $i++): ?>
              <div class="rating-item">
                <input type="radio" name="p2_rating" value="<?= $i ?>" required>
                <small><?= $i ?></small>
              </div>
            <?php endfor; ?>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Comentarios adicionales:</label>
          <textarea class="form-control" name="p2_text" rows="2" placeholder="Sugerencias de diseño..."></textarea>
        </div>
      </div>

      <div class="question-card">
        <h5 class="question-title">3. ¿Qué tan rápida y fluida sientes la plataforma?</h5>
        <div class="mb-3">
          <label class="form-label text-muted">Calificación (1 = Muy lenta, 10 = Muy rápida)</label>
          <div class="rating-options">
            <?php for($i=1; $i<=10; $i++): ?>
              <div class="rating-item">
                <input type="radio" name="p3_rating" value="<?= $i ?>" required>
                <small><?= $i ?></small>
              </div>
            <?php endfor; ?>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Comentarios adicionales:</label>
          <textarea class="form-control" name="p3_text" rows="2" placeholder="¿Has notado lentitud en alguna parte?"></textarea>
        </div>
      </div>

      <div class="question-card">
        <h5 class="question-title">4. ¿Qué tan útiles son las herramientas financieras proporcionadas?</h5>
        <div class="mb-3">
          <label class="form-label text-muted">Calificación (1 = Nada útiles, 10 = Muy útiles)</label>
          <div class="rating-options">
            <?php for($i=1; $i<=10; $i++): ?>
              <div class="rating-item">
                <input type="radio" name="p4_rating" value="<?= $i ?>" required>
                <small><?= $i ?></small>
              </div>
            <?php endfor; ?>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Comentarios adicionales:</label>
          <textarea class="form-control" name="p4_text" rows="2" placeholder="¿Qué herramienta mejorarías?"></textarea>
        </div>
      </div>

      <div class="text-center mt-4 mb-5">
        <button type="submit" class="btn btn-success btn-lg px-5">Enviar Encuesta</button>
      </div>

    </form>
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