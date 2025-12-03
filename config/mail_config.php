<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

function enviarCorreoRecuperacion($correo, $token) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;

        $mail->Username = 'senagdf@gmail.com';     
        $mail->Password = 'fbtnribpjarnnjzj';        

        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('senagdf@gmail.com', 'SENA GDF'); 
        $mail->addAddress($correo);
        $mail->isHTML(true);
        $mail->Subject = 'Recuperación de contraseña - SENA GDF';

        $link = "http://localhost/SENAGDF/restablecer.php?token=" . urlencode($token);

        $mail->Body = "
<html>
<body style='font-family: Arial, sans-serif; background-color: #f1f1f1; padding: 40px;'>

    <div style='max-width: 420px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);'>

        <h2 style='font-size: 26px; font-weight: bold; margin-bottom: 10px; text-align: left; color:#333;'>Nueva Contraseña</h2>

        <p style='font-size: 14px; color:#6c757d; margin-top: 0;'>
            Tu nueva contraseña debe ser diferente a la anterior. Debe tener mínimo 8 caracteres.
        </p>

        <p style='font-size: 15px; color:#444; margin-top: 25px;'>
            Haz clic en el botón para restablecer tu contraseña:
        </p>

        <div style='text-align: center; margin: 25px 0;'>
            <a href='$link' 
                style='display:inline-block; background-color:#303030; color:white; padding:12px 25px; font-size:16px; text-decoration:none; border-radius:5px;'>
                Restablecer Contraseña
            </a>
        </div>

        <p style='font-size: 13px; color:#6c757d; text-align:center;'>
            Este enlace expirará en 15 minutos.
        </p>

        <p style='margin-top:40px; font-size:13px; color:#6c757d; text-align:center;'>
            Si no solicitaste este cambio, simplemente ignora este mensaje.
        </p>

    </div>

</body>
</html>";


        $mail->AltBody = "Haz clic aquí para restablecer tu contraseña: $link";

        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log("Error al enviar correo: " . $mail->ErrorInfo);
        return false;
    }
}
?>



