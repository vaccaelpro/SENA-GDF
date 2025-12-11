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
    <title>Lista de Grupos - SENA GDF</title>
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
            <a href="#"><i class="bi bi-people-fill"></i> Grupos</a>
        </div>
    </div>

    <div class="bottom-links mt-auto">
        <hr>
        <a href="#"><i class="bi bi-gear-fill"></i> Ajustes</a>
        <a href="cerrar_sesio.php"><i class="bi bi-box-arrow-left"></i> Cerrar Sesión</a>
    </div>
</div>

<div class="main-content">
    <div class="text-white p-4 d-flex justify-content-between align-items-center header-fixed" id="header">
        <div>
            <h5 class="titulo">Bienvenido, <?= $nombre ?></h5>
            <p>Gestiona los grupos de aprendices</p>
        </div>
        <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2" style="font-size: 1.5rem;"></i>
            <span><?= $nombre ?></span>&nbsp;
            <i class="bi bi-caret-down-fill"></i>
            <span class="ms-3" id="clock"></span>
        </div>
    </div>

    <div class="p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3><i class="bi bi-people-fill text-success"></i> Lista de Grupos</h3>
            <a href="crear_grupo.php" class="btn btn-success">
                <i class="bi bi-plus-circle"></i> Crear Nuevo Grupo
            </a>
        </div>
        <div class="row g-4">
            <div class="col-md-6 col-lg-4">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-header text-white" style="background: linear-gradient(135deg, #28a745, #218838);">
                        <h5 class="mb-0"><i class="bi bi-people"></i> Grupo sostenimiento regular 2025</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted mb-2"><i class="bi bi-calendar3"></i> Creado: 01/12/2025</p>
                        <p class="card-text">Grupo de aprendices que estan adjudicados al sostenimiento regular</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="badge bg-success"><i class="bi bi-people"></i> 15 miembros</span>
                            <div class="btn-group" role="group">
                                <a href="chat_grupo.php?id=1" class="btn btn-sm btn-outline-success" title="Ver Chat">
                                    <i class="bi bi-chat-dots"></i>
                                </a>
                                <a href="#" class="btn btn-sm btn-outline-primary" title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <a href="#" class="btn btn-sm btn-outline-danger" title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-lg-4">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-header text-white" style="background: linear-gradient(135deg, #28a745, #218838);">
                        <h5 class="mb-0"><i class="bi bi-people"></i> Grupo sostenimiento de transporte 2025</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted mb-2"><i class="bi bi-calendar3"></i> Creado: 28/11/2025</p>
                        <p class="card-text">Grupo de aprendices que estan adjudicados al sostenimiento de transporte.</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="badge bg-success"><i class="bi bi-people"></i> 12 miembros</span>
                            <div class="btn-group" role="group">
                                <a href="chat_grupo.php?id=2" class="btn btn-sm btn-outline-success" title="Ver Chat">
                                    <i class="bi bi-chat-dots"></i>
                                </a>
                                <a href="#" class="btn btn-sm btn-outline-primary" title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <a href="#" class="btn btn-sm btn-outline-danger" title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-lg-4">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-header text-white" style="background: linear-gradient(135deg, #28a745, #218838);">
                        <h5 class="mb-0"><i class="bi bi-people"></i> Grupo sostenimiento de alimentación 2025</h5>  
                    </div>
                    <div class="card-body">
                        <p class="text-muted mb-2"><i class="bi bi-calendar3"></i> Creado: 25/11/2025</p>
                        <p class="card-text">Grupo de aprendices que estan adjudicados al sostenimiento de alimentación.</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="badge bg-success"><i class="bi bi-people"></i> 18 miembros</span>
                            <div class="btn-group" role="group">
                                <a href="chat_grupo.php?id=3" class="btn btn-sm btn-outline-success" title="Ver Chat">
                                    <i class="bi bi-chat-dots"></i>
                                </a>
                                <a href="#" class="btn btn-sm btn-outline-primary" title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <a href="#" class="btn btn-sm btn-outline-danger" title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </a>
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