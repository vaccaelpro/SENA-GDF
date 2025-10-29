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
            height: 68%;
            max-width: 400px;
            background-color: #f8f9fa;
        }

        .titulo-revisar {
            font-size: 30px;
            text-align: left;
            margin-left: 23px;
        }

        .textopeq {
            font-size: 14px;
            color: #6c757d;
        }

        .reenviar-link {
            color: rgb(91, 199, 3);
            text-decoration: underline;
        }

        .botonrecuperar {
            background-color: rgb(48, 48, 48);
            color: white;
            border: none;
            height: 40px;
            width: 255px;
        }
    </style>
</head>

<body class="d-flex justify-content-center align-items-center vh-100">
    <div class="p-5 rounded-5 text-center contenedor">
        <div>
            <p class="fw-bold titulo-revisar">Revisa tu correo</p>
            <p class="textopeq">Hemos enviado un link a tu correo, sigue los pasos para recuperar la contraseña</p>
            <p class="textopeq">
                ¿No recibiste ningún correo? Revisa en tu spam o intenta
                <a href="" class="reenviar-link">Reenviar correo.</a>
            </p>
        </div>
        <div>
            <input type="submit" value="Volver al inicio de sesión" id="restablecer"
                class="btn btn-primary fw-bold botonrecuperar">
        </div>
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
