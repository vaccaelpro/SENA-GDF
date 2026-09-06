const db = require("../../config/database");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fetch = require("node-fetch");
const logger = require("../../utils/logger");
const jwt = require("jsonwebtoken");


exports.validarLogin = async (tipo_documento, documento, contrasena) => {
    try {
        const [rows] = await db.query(
            `SELECT id_usuario, primer_nombre, primer_apellido, 
              correo_electronico, rol, contrasena 
       FROM usuario 
       WHERE tipo_documento = ? AND documento = ?`,
            [tipo_documento, documento]
        );

        if (rows.length === 0) {
            return { error: true, message: "Este usuario no está registrado" };
        }

        const usuario = rows[0];
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contrasenaValida) {
            return { error: true, message: "La contraseña es incorrecta" };
        }

        //Implementamos JWT generando el token firmado
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                rol: usuario.rol,
            },
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        return {
            success: true,
            token, //devolvemos el token generado
            usuario: {
                id_usuario: usuario.id_usuario,
                primer_nombre: usuario.primer_nombre,
                primer_apellido: usuario.primer_apellido,
                correo_electronico: usuario.correo_electronico,
                rol: usuario.rol,
            },
        };
    } catch (error) {
        logger.error('AUTH_SVC', 'Error en validarLogin', { error: error.message });
        throw error;
    }

};

// Agregarémos un nuevo método o función para cerrar sesión
// Usamos funciones de flecha pq son más sencillas de entender

exports.cerrarSesion = async () => {
    return { success: true, message: "Sesión cerrada correctamente" };
};

exports.registrarUsuario = async (data) => {
    const {
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        tipo_documento,
        documento,
        celular,
        correo_electronico,
        contrasena,
        grupo_formacion,
    } = data;

    try {
        const [existe] = await db.query(
            "SELECT id_usuario FROM usuario WHERE documento = ? OR correo_electronico = ?",
            [documento, correo_electronico]
        );

        if (existe.length > 0) {
            return {
                error: true,
                message: "El documento o correo ya se encuentra registrado",
            };
        }

        const hash = await bcrypt.hash(contrasena, 10);

        await db.query(
            `INSERT INTO usuario (
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        tipo_documento,
        documento,
        celular,
        grupo_formacion,
        correo_electronico,
        contrasena,
        rol,
        fecha_registro,
        ultima_actualizacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'USUARIO', NOW(), NOW())`,
            [
                primer_nombre,
                segundo_nombre || null,
                primer_apellido,
                segundo_apellido || null,
                tipo_documento,
                documento,
                celular,
                grupo_formacion,
                correo_electronico,
                hash,
            ]
        );

        return { success: true };
    } catch (error) {
        logger.error('AUTH_SVC', 'Error en registrarUsuario', { error: error.message });
        throw error;
    }

};


/**
 * Envía un correo electrónico utilizando la API REST de Brevo (Sendinblue).
 * Es 100% GRATUITA (300 correos/día), NO requiere tarjeta de crédito y funciona vía HTTPS (puerto 443),
 * evitando los bloqueos de puertos SMTP en plataformas de producción como Render.
 */
async function enviarCorreoBrevoAPI({ to, subject, html }) {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const emailUser = process.env.EMAIL_USER || "senagdf@gmail.com";

    if (!brevoApiKey) {
        throw new Error("Falta la variable BREVO_API_KEY en las variables de entorno.");
    }

    logger.info('AUTH_SVC', `Enviando correo con Brevo API`, { from: emailUser, to: to, subject: subject });

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": brevoApiKey,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            sender: { name: "SENA GDF - Soporte", email: emailUser },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html,
        }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
        logger.error('AUTH_SVC', 'Error al enviar correo via Brevo API', { status: response.status, error: responseData });
        throw new Error(`Error al enviar el correo via Brevo: ${responseData.message || 'Fallo en la entrega'}`);
    }

    logger.info('AUTH_SVC', 'Correo enviado exitosamente vía Brevo API', { messageId: responseData.messageId, to: to });
    return true;
}

/**
 * Envía un correo electrónico utilizando la API REST oficial de Gmail (OAuth2).
 */
async function enviarCorreoGmailAPI({ to, subject, html }) {
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
    const emailUser = process.env.EMAIL_USER || "senagdf@gmail.com";

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Faltan variables de configuración de correo (BREVO_API_KEY o GMAIL_CLIENT_ID).");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
        logger.error('AUTH_SVC', 'Error renovando access token de Gmail OAuth2', { error: tokenData });
        throw new Error(`Error de autenticación con Gmail: ${tokenData.error_description || tokenData.error}`);
    }

    const strEmail = [
        `From: "SENA GDF - Soporte" <${emailUser}>`,
        `To: ${to}`,
        `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        html,
    ].join('\r\n');

    const base64UrlEmail = Buffer.from(strEmail)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const gmailResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: base64UrlEmail }),
    });

    if (!gmailResponse.ok) {
        const errData = await gmailResponse.json().catch(() => ({}));
        logger.error('AUTH_SVC', 'Error al enviar mensaje vía Gmail API', { status: gmailResponse.status, error: errData });
        throw new Error("No se pudo enviar el correo a través de la API de Gmail.");
    }

    return true;
}

exports.generarTokenRecuperacion = async (correo, hostOrigin = null) => {
    const correoNormalizado = String(correo).trim().toLowerCase();

    const [usuarios] = await db.query(
        "SELECT id_usuario FROM usuario WHERE LOWER(TRIM(correo_electronico)) = ?",
        [correoNormalizado]
    );

    if (usuarios.length === 0) {
        throw new Error("Correo no registrado");
    }

    const usuarioId = usuarios[0].id_usuario;

    // Generar token plano seguro y hash SHA-256 para búsqueda ultrarrápida O(1)
    const tokenPlano = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(tokenPlano).digest("hex");

    // Invalidar TODOS los tokens anteriores del usuario — solo 1 token activo a la vez
    await db.query(
        `UPDATE recuperacion_contrasena
         SET fecha_restablecimiento = NOW()
         WHERE usuario_id_usuario = ?
           AND fecha_restablecimiento IS NULL`,
        [usuarioId]
    );

    // Insertar el nuevo token activo
    await db.query(
        `INSERT INTO recuperacion_contrasena (token, fecha_solicitud, usuario_id_usuario)
         VALUES (?, NOW(), ?)`,
        [tokenHash, usuarioId]
    );

    // Determinar URL del frontend: producción tiene prioridad sobre localhost
    let frontUrl = hostOrigin ? String(hostOrigin).replace(/\/$/, "") : "";
    const envFrontUrl = process.env.FRONT_URL ? process.env.FRONT_URL.replace(/\/$/, "") : "";
    if (!frontUrl || (frontUrl.includes("localhost") && envFrontUrl && !envFrontUrl.includes("localhost"))) {
        frontUrl = envFrontUrl;
    }
    if (!frontUrl) {
        frontUrl = "http://localhost:3000";
    }

    const enlace = `${frontUrl}/restablecer/${tokenPlano}`;
    const anioActual = new Date().getFullYear();

    const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #28a745; margin: 0;">SENA GDF</h1>
                <p style="color: #666; font-size: 16px;">Gestión de Finanzas</p>
            </div>
            <h2 style="color: #333; text-align: center;">Recuperación de Contraseña</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Hola,<br><br>
                Has solicitado restablecer tu contraseña para acceder al sistema SENA GDF.
                Si no reconoces esta solicitud, puedes ignorar este correo de forma segura.
            </p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${enlace}"
                   style="background-color: #28a745; color: white; padding: 15px 30px;
                          text-decoration: none; border-radius: 8px; font-weight: bold;
                          font-size: 18px; display: inline-block;">
                    Restablecer Contraseña
                </a>
            </div>
            <p style="color: #888; font-size: 14px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                Este enlace es válido únicamente por <b>15 minutos</b>.<br>
                Al solicitar un nuevo enlace, el anterior queda automáticamente invalidado.
            </p>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #aaa;">
                &copy; ${anioActual} SENA GDF. Todos los derechos reservados.
            </div>
        </div>
    </div>`;

    // Envío del correo utilizando la API disponible (Brevo API o Gmail API)
    if (process.env.BREVO_API_KEY) {
        await enviarCorreoBrevoAPI({
            to: correoNormalizado,
            subject: "Recuperación de Contraseña - SENA GDF",
            html: htmlBody,
        });
        logger.info('AUTH_SVC', 'Correo de recuperación enviado exitosamente vía Brevo API', { usuarioId, destinatario: correoNormalizado });
    } else if (process.env.GMAIL_CLIENT_ID) {
        await enviarCorreoGmailAPI({
            to: correoNormalizado,
            subject: "Recuperación de Contraseña - SENA GDF",
            html: htmlBody,
        });
        logger.info('AUTH_SVC', 'Correo de recuperación enviado exitosamente vía Gmail API', { usuarioId, destinatario: correoNormalizado });
    } else {
        logger.error('AUTH_SVC', 'No se ha configurado ninguna API de correo (BREVO_API_KEY ni GMAIL_CLIENT_ID)');
        throw new Error("Configuración del servidor de correo incompleta en el servidor. Contacta al administrador.");
    }

    return { success: true };
};

/**
 * Valida un token de recuperación plano recibido del usuario.
 * @param {string} tokenPlano - El token en texto plano enviado por URL
 * @returns {Promise<object>} Registro de recuperación encontrado si es válido
 */
exports.validarTokenRecuperacion = async (tokenPlano) => {
    if (!tokenPlano || typeof tokenPlano !== 'string') {
        throw new Error("Token de recuperación no proporcionado");
    }

    const tokenHash = crypto.createHash("sha256").update(tokenPlano).digest("hex");

    // 1. Búsqueda directa ultrarrápida por hash SHA-256 o token exacto (O(1))
    const [tokensDirectos] = await db.query(
        `SELECT id_recuperacion, token, fecha_solicitud, usuario_id_usuario,
                TIMESTAMPDIFF(MINUTE, fecha_solicitud, NOW()) AS minutos_transcurridos
         FROM recuperacion_contrasena 
         WHERE (token = ? OR token = ?) AND fecha_restablecimiento IS NULL
         ORDER BY id_recuperacion DESC
         LIMIT 1`,
        [tokenHash, tokenPlano]
    );

    let registro = tokensDirectos.length > 0 ? tokensDirectos[0] : null;

    // 2. Fallback para tokens legados almacenados con bcrypt
    if (!registro) {
        const [tokensBcrypt] = await db.query(
            `SELECT id_recuperacion, token, fecha_solicitud, usuario_id_usuario,
                    TIMESTAMPDIFF(MINUTE, fecha_solicitud, NOW()) AS minutos_transcurridos
             FROM recuperacion_contrasena 
             WHERE fecha_restablecimiento IS NULL AND token LIKE '$2%'
             ORDER BY id_recuperacion DESC
             LIMIT 5`
        );

        for (const r of tokensBcrypt) {
            const coincide = await bcrypt.compare(tokenPlano, r.token);
            if (coincide) {
                registro = r;
                break;
            }
        }
    }

    if (!registro) {
        throw new Error("El enlace de recuperación es inválido o ya fue utilizado.");
    }

    // 3. Validación de expiración estricta de 15 minutos calculada directamente por la BD
    if (registro.minutos_transcurridos > 15) {
        await db.query(
            `UPDATE recuperacion_contrasena SET fecha_restablecimiento = NOW() WHERE id_recuperacion = ?`,
            [registro.id_recuperacion]
        );
        throw new Error("El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.");
    }

    return registro;
};

exports.cambiarPassword = async (tokenPlano, nuevaContrasena) => {
    try {
        if (!nuevaContrasena || nuevaContrasena.length < 8) {
            throw new Error("La nueva contraseña debe tener al menos 8 caracteres.");
        }

        // Validar el token usando el método de búsqueda rápida
        const registro = await exports.validarTokenRecuperacion(tokenPlano);

        // Hashear la nueva contraseña
        const hash = await bcrypt.hash(nuevaContrasena, 10);

        // Actualizar la contraseña del usuario
        await db.query(
            "UPDATE usuario SET contrasena = ?, ultima_actualizacion = NOW() WHERE id_usuario = ?",
            [hash, registro.usuario_id_usuario]
        );

        // Invalidar TODOS los tokens de recuperación pendientes del usuario (evita reutilización)
        await db.query(
            `UPDATE recuperacion_contrasena 
             SET fecha_restablecimiento = NOW() 
             WHERE usuario_id_usuario = ? 
               AND fecha_restablecimiento IS NULL`,
            [registro.usuario_id_usuario]
        );

        logger.info('AUTH_SVC', 'Contraseña restablecida exitosamente para el usuario', { id_usuario: registro.usuario_id_usuario });
        return { success: true };

    } catch (error) {
        logger.error('AUTH_SVC', 'Error en cambiarPassword', { error: error.message });
        throw error;
    }
};
