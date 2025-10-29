<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/recuperarcontraseña.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">

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
        }

        .botonrecuperar {
            background-color: rgb(48, 48, 48);
            color: white;
            border: none;
            height: 40px;
            width: 255px;
        }

        .link-regresar {
            color: rgb(91, 199, 3);
            text-decoration: underline;
            margin-top: 100px;
        }
    </style>
</head>

<body class="d-flex justify-content-center align-items-center vh-100">
    <div class="p-5 rounded-5 text-center contenedor">
        <div>
            <p class="fw-bold titulo">Nueva Contraseña</p>
            <p class="textopeq">Tu nueva contraseña debe ser diferente a la anterior. Mínimo de 8 caractéres</p>
        </div>

        <form action="" method="post">
            <p class="textopeq-lg">Nueva contraseña</p>
            <div class="input-group mb-3 justify-content-center">
                <div class="input-group-text">
                    <ion-icon name="lock-closed-outline" class="icono"></ion-icon>
                </div>
                <div>
                    <input type="password" name="nueva_contraseña" id="nueva_contraseña" placeholder="Ingresar Contraseña" class="input-custom" required>
                </div>
            </div>

            <p class="textopeq-lg">Confirma tu contraseña</p>
            <div class="input-group mb-3 justify-content-center">
                <div class="input-group-text">
                    <ion-icon name="lock-closed-outline" class="icono"></ion-icon>
                </div>
                <div>
                    <input type="password" name="confirmar_contraseña" id="confirmar_contraseña" placeholder="Ingresar Contraseña" class="input-custom" required>
                </div>
            </div>

            <div>
                <input type="submit" value="Restablecer Contraseña" id="restablecer"
                    class="btn btn-primary fw-bold botonrecuperar">
            </div>
        </form>

        <br>

        <a href="">
            <p class="link-regresar">Regresa para iniciar sesión</p>
        </a>
    </div>

    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.min.js"
        integrity="sha384-7qAoOXltbVP82dhxHAUje59V5r2YsVfBafyUDxEdApLPmcdhBPg1DKg1ERo0BZlK"
        crossorigin="anonymous"></script>
</body>

</html>
