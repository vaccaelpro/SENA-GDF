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
    <title>Mensajes - Aprendiz - SENA GDF</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="css/eliminar_novedades.css">
    <link rel="stylesheet" href="css/gestiousuarios.css">
    <style>
        .chat-container {
            height: 500px;
            overflow-y: auto;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
        }
        .mensaje {
            margin-bottom: 15px;
            padding: 12px 15px;
            border-radius: 15px;
            max-width: 70%;
            animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .mensaje-admin {
            background: linear-gradient(135deg, #28a745, #218838);
            color: white;
            margin-left: auto;
            text-align: right;
        }
        .mensaje-info {
            background: #e9ecef;
            color: #495057;
            text-align: center;
            max-width: 100%;
            font-size: 0.85rem;
        }
        .mensaje-header {
            font-weight: bold;
            font-size: 0.9rem;
            margin-bottom: 5px;
        }
        .mensaje-fecha {
            font-size: 0.75rem;
            opacity: 0.8;
            margin-top: 5px;
        }
    </style>
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
            <h5 class="titulo">Mensajes del Instructor</h5>
            <p>Información importante de bienestar</p>
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
            <div class="card-header text-white d-flex justify-content-between align-items-center" style="background: linear-gradient(135deg, #28a745, #218838);">
                <div>
                    <h5 class="mb-0"><i class="bi bi-chat-dots"></i> Mensajes de Bienestar</h5>
                    <small>Solo lectura - Información del instructor</small>
                </div>
                <span class="badge bg-light text-success"><i class="bi bi-eye"></i> Modo lectura</span>
            </div>

            <div class="card-body p-0">
                <div class="chat-container" id="chatContainer">
                    <div class="mensaje mensaje-info">
                        <i class="bi bi-info-circle"></i> Inicio del chat - 01/12/2025
                    </div>

                    <div class="mensaje mensaje-admin">
                        <div class="mensaje-header"><i class="bi bi-shield-fill-check"></i> Leidy Callejas</div>
                        <div>Bienvenidos al chat del grupo. Aquí podrán recibir información importante sobre todo el tema del apoyo.</div>
                        <div class="mensaje-fecha">Hoy 08:30 AM</div>
                    </div>

                    <div class="mensaje mensaje-admin">
                        <div class="mensaje-header"><i class="bi bi-shield-fill-check"></i> Leidy Callejas</div>
                        <div>Buenos dias aprendices, por favor las personas que les tengo dotación pasar por bienestar el dia de hoy.</div>
                        <div class="mensaje-fecha">Hoy 09:15 AM</div>
                    </div>

                    <div class="mensaje mensaje-admin">
                        <div class="mensaje-header"><i class="bi bi-shield-fill-check"></i> Leidy Callejas</div>
                        <div>Estimados aprendices: Durante el año se presentaron varias convocatorias para apoyos de sostenimiento, por lo que la gestión de los desembolsos se realiza a través de estas. Esto significa que los desembolsos no llegan todos el mismo día, sino que se efectúan de manera gradual durante el transcurso del mes. Seguimos realizando las gestiones correspondientes y, con la ayuda de Dios, si no surgen novedades, al finalizar la semana los apoyos serán efectivos en sus cuentas de ahorro.</div>
                        <div class="mensaje-fecha">Hoy 10:20 AM</div>
                    </div>

                    <div class="mensaje mensaje-info">
                        <i class="bi bi-calendar3"></i> 2 de Diciembre, 2025
                    </div>

                    <div class="mensaje mensaje-admin">
                        <div class="mensaje-header"><i class="bi bi-shield-fill-check"></i> Leidy Callejas</div>
                        <div>Recuerden que los aprendices nuevos este mes no les llega el desembolso</div>
                        <div class="mensaje-fecha">Hoy 08:20 AM</div>
                    </div>
                </div>

                <div class="p-3 border-top bg-light text-center">
                    <div class="alert alert-info mb-0">
                        <i class="bi bi-lock"></i> Solo el instructor puede enviar mensajes en este chat.
                        <br><small>Aquí recibirás información importante sobre bienestar y sostenimiento.</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-3">
            <a href="mi_grupo.php" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> Volver a Mi Grupo
            </a>
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

    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
</script>

<script src="js/session_timeout.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
