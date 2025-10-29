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
                <a href="nueva_novedad.html"> Agregar Novedades</a>
                <a href="#"> Eliminar Novedades</a>
            </div>
        </div>
        <div class="menu-item">
            <a href="gestiondeusuarios.html"><i class="bi bi-person-fill-gear"></i> Gestión de Usuario</a>
        </div>
        <div class="menu-item">
            <a href="#"><i class="bi bi-download"></i> Exportación de Datos</a>
            <div class="submenu">
                <a href="exportar_finanzas.html"> Finanzas</a>
                <a href="exportar_personal.html"> Personal</a>
            </div>
        </div>
        <div class="menu-item">
            <a href="#"><i class="bi bi-chat-right-text-fill"></i> Encuestas y Análisis</a>
            <div class="submenu">
                <a href="#"> Encuestas</a>
                <a href="#"> Análisis</a>
            </div>
        </div>
    </div>
    <div class="bottom-links mt-auto">
        <hr>
        <a href="#"><i class="bi bi-gear-fill"></i> Ajustes</a>
        <a href="login.html"><i class="bi bi-box-arrow-left"></i> Cerrar Sesión</a>
    </div>
</div>

<div class="main-content">
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

    <div class="container mt-5">
        <h3 class="mb-4">Publicaciones</h3>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
            <div class="col mb-4">
                <div class="card h-100 text-center">
                    <img src="img/publicacion1.jpg" class="card-img-top" alt="Imagen de publicación">
                    <div class="card-body">
                        <h5 class="card-title">Publicación 1</h5>
                        <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
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
                        <h5 class="card-title">Publicación 2</h5>
                        <p class="card-text">Aliquam erat volutpat. Sed ut perspiciatis unde omnis iste natus error.</p>
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
                        <h5 class="card-title">Publicación 3</h5>
                        <p class="card-text">Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis.</p>
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
                        <h5 class="card-title">Publicación 4</h5>
                        <p class="card-text">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
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


