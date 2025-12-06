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
<body style='font-family: Arial, sans-serif; background: linear-gradient(135deg, #28a745, #2d3436); padding: 40px;'>

    <div style='max-width: 450px; margin: auto; background-color: #2d3436; border-radius: 20px; padding: 35px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);'>

        <h2 style='font-size: 28px; font-weight: bold; margin-bottom: 15px; text-align: center; color:#ffffff;'>Nueva Contraseña</h2>

        <p style='font-size: 14px; color:#dfe6e9; margin-top: 0; text-align:center;'>
            Tu nueva contraseña debe ser diferente a la anterior. Debe tener mínimo 8 caracteres.
        </p>

        <p style='font-size: 15px; color:#dfe6e9; margin-top: 25px; text-align:center;'>
            Haz clic en el botón para restablecer tu contraseña:
        </p>

        <div style='text-align: center; margin: 30px 0;'>
            <a href='$link' 
                style='display:inline-block; background-color:#28a745; color:white; padding:14px 30px; font-size:16px; font-weight:bold; text-decoration:none; border-radius:8px; transition:0.3s; box-shadow: 0 4px 12px rgba(40,167,69,0.3);'>
                Restablecer Contraseña
            </a>
        </div>

        <p style='font-size: 13px; color:#1abc9c; text-align:center; font-weight:bold;'>
            Este enlace expirará en 15 minutos.
        </p>

        <p style='margin-top:40px; font-size:13px; color:#dfe6e9; text-align:center;'>
            Si no solicitaste este cambio, simplemente ignora este mensaje.
        </p>

        <div style='text-align:center; margin-top:30px; padding-top:20px; border-top: 1px solid #4a5568;'>
            <p style='font-size:12px; color:#a0aec0; margin:0;'>SENA GDF - Sistema de Gestión de Finanzas</p>
        </div>

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



