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
    <title>Panel Administrador</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="css/eliminar_novedades.css">
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
                <a href="#"> Eliminar Novedades</a>
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

    <div class="container mt-5">
        <h3 class="mb-4">Publicaciones</h3>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
            <div class="col mb-4">
                <div class="card h-100 text-center">
                    <img src="img/publicacion1.jpg" class="card-img-top" alt="Imagen de publicación">
                    <div class="card-body">
                        <h5 class="card-title">Convocatoria de Apoyo de Sostenimiento 2024</h5>
                        <p class="card-text">Material institucional del Centro Textil y de Gestión Industrial que acompaña la difusión de la Convocatoria de Apoyo de Sostenimiento 2024. La pieza promueve la participación de los aprendices en el proceso de postulación, destacando la disponibilidad de apoyos económicos destinados a facilitar su permanencia y continuidad en la formación. La imagen refuerza el mensaje institucional mediante elementos visuales alusivos a la identidad del SENA.</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-success">Modificar</button>
                            <button class="btn btn-danger">Borrar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col mb-4">
                <div class="card h-100 text-center">
                    <img src="img/publicacion2.jpg" class="card-img-top" alt="Imagen de publicación">
                    <div class="card-body">
                        <h5 class="card-title">Jornada de Salud y Bienestar Integral</h5>
                        <p class="card-text">Comunicación oficial del Centro Textil y de Gestión Industrial destinada a instructores y aprendices, en la que se resalta la importancia de consultar y diligenciar el Formato de Paz y Salvo de finalización de Etapa Productiva. La pieza se complementa con la invitación a la Jornada de Salud y Bienestar Integral, un evento orientado a promover el cuidado personal mediante servicios de atención médica, asesoría nutricional, actividades deportivas y espacios de orientación para el bienestar emocional.</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-success">Modificar</button>
                            <button class="btn btn-danger">Borrar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col mb-4">
                <div class="card h-100 text-center">
                    <img src="img/publicacion3.jpg" class="card-img-top" alt="Imagen de publicación">
                    <div class="card-body">
                        <h5 class="card-title">Necesidades para aprendices.</h5>
                        <p class="card-text">Material informativo del programa Bienestar al Aprendiz que invita a los estudiantes a participar en la encuesta institucional de necesidades. La campaña promueve la colaboración y el apoyo mutuo entre los aprendices con el fin de fortalecer los servicios y estrategias de acompañamiento</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-success">Modificar</button>
                            <button class="btn btn-danger">Borrar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col mb-4">
                <div class="card h-100 text-center">
                    <img src="img/publicacion4.jpg" class="card-img-top" alt="Imagen de publicación">
                    <div class="card-body">
                        <h5 class="card-title">Nueva oferta presencial SENA</h5>
                        <p class="card-text">Anuncio institucional del SENA que comunica la disponibilidad de una nueva oferta formativa presencial e invita a los interesados a realizar su inscripción a través de la plataforma oficial Sofiaplus. La pieza destaca el compromiso de la entidad con brindar oportunidades educativas de alta calidad</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-success">Modificar</button>
                            <button class="btn btn-danger">Borrar</button>
                        </div>
                    </div>
                </div>
            </div>
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


