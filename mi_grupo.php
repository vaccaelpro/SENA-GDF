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
    <title>Mi Grupo - SENA GDF</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="css/eliminar_novedades.css">
    <link rel="stylesheet" href="css/gestiousuarios.css">
</head>
<body>

<div class="sidebar d-flex flex-column p-3">
    <div class="text-center mb-4">
        <img src="img/logosena2.png" alt="SENA" class="img-fluid mb-2 logo-sena">
        <h5 class="titulo">SENA GDF</h5>
        <p>Aprendiz</p>
    </div>
    <hr>

    <div class="menu-container flex-grow-1 d-flex flex-column justify-content-center">
        <div class="menu-item">
            <a href="novedades_aprendiz.php"><i class="bi bi-newspaper" id="icn">&nbsp;</i>Novedades</a>
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
        <a href="editar.php"><i class="bi bi-gear-fill"></i> Ajustes</a>
        <a href="cerrar_sesio.php"><i class="bi bi-box-arrow-left"></i> Cerrar Sesión</a>
    </div>
</div>

<div class="main-content">
    <div class="text-white p-4 d-flex justify-content-between align-items-center header-fixed" id="header">
        <div>
            <h5 class="titulo">Mi Grupo</h5>
            <p>Información de tu grupo de formación</p>
        </div>
        <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2" style="font-size: 1.5rem;"></i>
            <span><?= $nombre ?></span>&nbsp;
            <i class="bi bi-caret-down-fill"></i>
            <span class="ms-3" id="clock"></span>
        </div>
    </div>

    <div class="p-4">
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-header text-white" style="background: linear-gradient(135deg, #28a745, #218838);">
                <h4 class="mb-0"><i class="bi bi-people"></i> Grupo sostenimiento regular</h4>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong><i class="bi bi-calendar3 text-success"></i> Fecha de creación:</strong> 01/12/2025</p>
                        <p><strong><i class="bi bi-person-badge text-success"></i> Leydi callejas</p>
                        <p><strong><i class="bi bi-people text-success"></i> Total de miembros:</strong> 15 aprendices</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong><i class="bi bi-card-text text-success"></i> Descripción:</strong></p>
                        <p class="text-muted">Grupo de aprendices que estan adjudicados al sostenimiento regular</p>
                    </div>
                </div>
                <div class="mt-3">
                    <a href="chat_aprendiz.php" class="btn btn-success">
                        <i class="bi bi-chat-dots"></i> Ver Mensajes
                    </a>
                </div>
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-header bg-light">
                <h5 class="mb-0"><i class="bi bi-people-fill text-success"></i> Miembros del Grupo</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex align-items-center p-2 border rounded">
                            <i class="bi bi-person-circle text-success" style="font-size: 2rem;"></i>
                            <div class="ms-3">
                                <strong>Juan Pérez García</strong>
                                <br><small class="text-muted">ID: 1003456789</small>
                            </div>
                        </div>
                    </div>

                    <!-- Miembro 2 -->
                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex align-items-center p-2 border rounded">
                            <i class="bi bi-person-circle text-success" style="font-size: 2rem;"></i>
                            <div class="ms-3">
                                <strong>María López Ramírez</strong>
                                <br><small class="text-muted">ID: 1003456790</small>
                            </div>
                        </div>
                    </div>

                    <!-- Miembro 3 -->
                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex align-items-center p-2 border rounded">
                            <i class="bi bi-person-circle text-success" style="font-size: 2rem;"></i>
                            <div class="ms-3">
                                <strong>Carlos Rodríguez Sánchez</strong>
                                <br><small class="text-muted">ID: 1003456791</small>
                            </div>
                        </div>
                    </div>

                    <!-- Miembro 4 -->
                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex align-items-center p-2 border rounded">
                            <i class="bi bi-person-circle text-success" style="font-size: 2rem;"></i>
                            <div class="ms-3">
                                <strong>Ana Martínez Torres</strong>
                                <br><small class="text-muted">ID: 1003456792</small>
                            </div>
                        </div>
                    </div>

                    <!-- Miembro 5 -->
                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex align-items-center p-2 border rounded">
                            <i class="bi bi-person-circle text-success" style="font-size: 2rem;"></i>
                            <div class="ms-3">
                                <strong>Luis Gómez Hernández</strong>
                                <br><small class="text-muted">ID: 1003456793</small>
                            </div>
                        </div>
                    </div>

                    <!-- Miembro actual (tú) -->
                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex align-items-center p-2 border rounded bg-success bg-opacity-10">
                            <i class="bi bi-person-circle text-success" style="font-size: 2rem;"></i>
                            <div class="ms-3">
                                <strong><?= $nombre ?></strong>
                                <br><small class="text-success"><i class="bi bi-check-circle-fill"></i> Tú</small>
                            </div>
                        </div>
                    </div>

                    <!-- Más miembros (ejemplo) -->
                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex align-items-center p-2 border rounded">
                            <i class="bi bi-person-circle text-success" style="font-size: 2rem;"></i>
                            <div class="ms-3">
                                <strong>Laura Díaz Moreno</strong>
                                <br><small class="text-muted">ID: 1003456794</small>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex align-items-center p-2 border rounded">
                            <i class="bi bi-person-circle text-success" style="font-size: 2rem;"></i>
                            <div class="ms-3">
                                <strong>Pedro Ramírez Cruz</strong>
                                <br><small class="text-muted">ID: 1003456795</small>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex align-items-center p-2 border rounded">
                            <i class="bi bi-person-circle text-success" style="font-size: 2rem;"></i>
                            <div class="ms-3">
                                <strong>Sofía González Vargas</strong>
                                <br><small class="text-muted">ID: 1003456796</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function updateClock() {
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
