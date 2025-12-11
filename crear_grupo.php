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
    <title>Crear Grupo - SENA GDF</title>
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
            <div class="submenu">
                <a href="crear_grupo.php"> Crear Grupo</a>
                <a href="lista_grupos.php"> Ver Grupos</a>
            </div>
        </div>

        <div class="menu-item">
            <a href="chat_grupo.php"><i class="bi bi-chat-dots-fill"></i> Chat del Grupo</a>
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
            <p>Crea un nuevo grupo para tus aprendices</p>
        </div>
        <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2" style="font-size: 1.5rem;"></i>
            <span><?= $nombre ?></span>&nbsp;
            <i class="bi bi-caret-down-fill"></i>
            <span class="ms-3" id="clock"></span>
        </div>
    </div>

    <div class="p-4">
        <div class="card shadow-sm border-0">
            <div class="card-header text-white" style="background: linear-gradient(135deg, #28a745, #218838);">
                <h4 class="mb-0"><i class="bi bi-plus-circle"></i> Crear Nuevo Grupo</h4>
            </div>
            <div class="card-body p-4">
                <form>
                    <div class="mb-4">
                        <label for="nombre_grupo" class="form-label fw-bold"><i class="bi bi-tag"></i> Nombre del Grupo</label>
                        <input type="text" class="form-control form-control-lg" id="nombre_grupo" 
                               placeholder="Ej: Apoyo regular 2025" maxlength="100">
                    </div>

                    <div class="mb-4">
                        <label for="descripcion" class="form-label fw-bold"><i class="bi bi-card-text"></i> Descripción</label>
                        <textarea class="form-control" id="descripcion" rows="3" 
                                  placeholder="Descripción breve del grupo"></textarea>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-bold">Seleccionar el tipo de ayuda</label>
                        <div class="border rounded p-3 bg-light" style="max-height: 350px; overflow-y: auto;">
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="usuario1">
                                <label class="form-check-label" for="usuario1">
                                    <p>Apoyo regular</p>
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="usuario2">
                                <label class="form-check-label" for="usuario2">
                                    <p>Apoyo de alimentación</p>
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="usuario3">
                                <label class="form-check-label" for="usuario3">
                                    <p>Apoyo de transporte</p>
                                </label>
                            </div>
                        </div>
                        <small class="text-muted"><i class="bi bi-info-circle"></i> Selecciona la opción que corresponde</small>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-success btn-lg">
                            <i class="bi bi-check-circle"></i> Crear Grupo
                        </button>
                        <a href="lista_grupos.php" class="btn btn-secondary btn-lg">
                            <i class="bi bi-arrow-left"></i> Cancelar
                        </a>
                    </div>
                </form>
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
