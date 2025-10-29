<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administrador</title>
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
                <a href="agregar_meta.html"> Agregar Novedades</a>
                <a href="eliminar_novedades.html"> Eliminar Novedades</a>
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

    <div class="p-4">
                <div class="input-group mb-4">
                    <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-start-0" placeholder="Buscar usuario">
                </div>

                <table class="table table-bordered align-middle text-center">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Documento</th>
                            <th>Modificar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Santiago</td>
                            <td>Vacca</td>
                            <td>1013109723</td>
                            <td><button class="btn btn-dark btn-sm"><i class="bi bi-pencil-square"></i></button></td>
                            <td><button class="btn btn-dark btn-sm"><i class="bi bi-trash3-fill"></i></button></td>
                        </tr>
                        <tr>
                            <td>Dayam</td>
                            <td>Beltran</td>
                            <td>1020223830</td>
                            <td><button class="btn btn-dark btn-sm"><i class="bi bi-pencil-square"></i></button></td>
                            <td><button class="btn btn-dark btn-sm"><i class="bi bi-trash3-fill"></i></button></td>
                        </tr>
                        <tr>
                            <td>Sara</td>
                            <td>Villada</td>
                            <td>1013460683</td>
                            <td><button class="btn btn-dark btn-sm"><i class="bi bi-pencil-square"></i></button></td>
                            <td><button class="btn btn-dark btn-sm"><i class="bi bi-trash3-fill"></i></button></td>
                        </tr>
                    </tbody>
                </table>
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


