<?php
include("config/db.php");

$mensaje = "";
$id_usuario = null;

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    $stmt = $conn->prepare("SELECT usuario_id_usuario, fecha_solicitud, fecha_restablecimiento FROM recuperacion_contrasena WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $id_usuario = $row['usuario_id_usuario'];
        $fecha_solicitud = $row['fecha_solicitud'];
        $fecha_restablecimiento = $row['fecha_restablecimiento'];

        $expira = strtotime($fecha_solicitud) + (15 * 60);

        if ($fecha_restablecimiento !== null) {
            $mensaje = "Este enlace ya fue utilizado.";
            $id_usuario = null;
        } elseif (time() > $expira) {
            $mensaje = "El enlace de recuperación ha expirado. Solicita uno nuevo.";
            $id_usuario = null;
        } else {
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $nueva = $_POST['nueva_contrasena'];
                $confirmar = $_POST['confirmar_contrasena'];

                if ($nueva !== $confirmar) {
                    $mensaje = "Las contraseñas no coinciden.";
                } elseif (strlen($nueva) < 8) {
                    $mensaje = "La contraseña debe tener al menos 8 caracteres.";
                } else {
                    $stmt2 = $conn->prepare("SELECT contrasena FROM Usuario WHERE id_usuario = ?");
                    $stmt2->bind_param("i", $id_usuario);
                    $stmt2->execute();
                    $res2 = $stmt2->get_result();
                    $usuario = $res2->fetch_assoc();

                    if (password_verify($nueva, $usuario['contrasena'])) {
                        $mensaje = "La nueva contraseña no puede ser igual a la anterior.";
                    } else {
                        $hash = password_hash($nueva, PASSWORD_DEFAULT);
                        $update = $conn->prepare("UPDATE Usuario SET contrasena = ?, ultima_actualizacion = NOW() WHERE id_usuario = ?");
                        $update->bind_param("si", $hash, $id_usuario);
                        $update->execute();

                        $stmt3 = $conn->prepare("UPDATE recuperacion_contrasena SET fecha_restablecimiento = NOW() WHERE token = ?");
                        $stmt3->bind_param("s", $token);
                        $stmt3->execute();

                        $mensaje = "Contraseña actualizada correctamente. Serás redirigido al login...";
                        header("refresh:2;url=login.php");
                        $id_usuario = null;
                    }
                }
            }
        }
    } else {
        $mensaje = "Token inválido o no encontrado.";
    }
} else {
    $mensaje = "Solicitud inválida.";
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <link rel="stylesheet" href="css/recuperarcontraseña.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        .contenedor {
            max-width: 400px;
            background-color: #f8f9fa;
        }

        .titulo {
            font-size: 30px;
            text-align: left;
            margin-left: 23px;
        }

        .textopeq {
            font-size: 14px;
            color: #6c757d;
        }

        .textopeq-lg {
            font-size: 15px;
            color: #6c757d;
        }

        .icono {
            font-size: 20px;
        }

        .input-custom {
            border: 1px solid #ced4da;
            border-radius: 0.375rem;
            padding: 0.375rem 0.75rem;
            width: 220px;
        }

        .botonrecuperar {
            background-color: rgb(48, 48, 48);
            color: white;
            border: none;
            height: 40px;
            width: 255px;
        }

        .toggle-pass {
            cursor: pointer;
            margin-left: 20px;
            padding-left: 5px;
            font-size: 22px;
            margin-top:8px;
        }
    </style>
</head>

<body class="d-flex justify-content-center align-items-center vh-100">

    <div class="p-5 rounded-5 text-center contenedor">

        <p class="fw-bold titulo">Nueva Contraseña</p>
        <p class="textopeq">Tu nueva contraseña debe ser diferente a la anterior. Mínimo 8 caracteres.</p>

        <?php if ($mensaje) { ?>
            <div class="alert alert-info"><?= $mensaje ?></div>
        <?php } ?>

        <?php if ($id_usuario) { ?>
        <form method="POST">

            <p class="textopeq-lg">Nueva contraseña</p>
            <div class="input-group mb-3 justify-content-center">
                <div class="input-group-text">
                    <ion-icon name="lock-closed-outline" class="icono"></ion-icon>
                </div>

                <input type="password" name="nueva_contrasena" id="nueva_contrasena"
                    placeholder="Ingresar Contraseña" class="input-custom" required>

                <ion-icon name="eye-outline" class="toggle-pass" onclick="togglePass('nueva_contrasena', this)"></ion-icon>
            </div>

            <p class="textopeq-lg">Confirma tu contraseña</p>
            <div class="input-group mb-3 justify-content-center">
                <div class="input-group-text">
                    <ion-icon name="lock-closed-outline" class="icono"></ion-icon>
                </div>

                <input type="password" name="confirmar_contrasena" id="confirmar_contrasena"
                    placeholder="Confirmar Contraseña" class="input-custom" required>

                <ion-icon name="eye-outline" class="toggle-pass" onclick="togglePass('confirmar_contrasena', this)"></ion-icon>
            </div>

            <div>
                <input type="submit" value="Restablecer Contraseña" id="restablecer"
                    class="btn btn-primary fw-bold botonrecuperar">
            </div>

        </form>
        <?php } ?>

    </div>

    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    <script>
        function togglePass(id, icon) {
            const input = document.getElementById(id);
            const isText = input.type === "text";
            input.type = isText ? "password" : "text";
            icon.setAttribute("name", isText ? "eye-outline" : "eye-off-outline");
        }
    </script>

</body>
</html>

