const db = require("../../config/database");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
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
            process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN}
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
    return {success: true, message: "Sesión cerrada correctamente" };
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


exports.generarTokenRecuperacion = async (correo) => {
    const [usuarios] = await db.query(
        "SELECT id_usuario FROM usuario WHERE correo_electronico = ?",
        [correo]
    );

    if (usuarios.length === 0) {
        throw new Error("Correo no registrado");
    }

    const usuarioId = usuarios[0].id_usuario;

    const tokenPlano = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(tokenPlano, 10);
    // Es necesario crear una actualización en la base de datos para invalidar los otros tokens generados para que solo funcione el actual
    // Esto se hace para evitar que puedan llegar a usar tokens que deberían estar inválidos

    await db.query(
        `UPDATE recuperacion_contrasena
        SET fecha_restablecimiento = NOW()
        WHERE usuario_id_usuario = ?
        AND fecha_restablecimiento IS NULL`, [usuarioId]
    );


    // Aquí se está generando un nuevo token
    await db.query(
        `INSERT INTO recuperacion_contrasena 
     (token, fecha_solicitud, usuario_id_usuario)
     VALUES (?, NOW(), ?)`,
        [tokenHash, usuarioId]
    );

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const enlace = `${process.env.FRONT_URL}/restablecer/${tokenPlano}`;

    await transporter.sendMail({
        from: `"SENA GDF - Soporte" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: "Recuperación de Contraseña - SENA GDF",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #28a745; margin: 0;">SENA GDF</h1>
                    <p style="color: #666; font-size: 16px;">Gestión de Finanzas</p>
                </div>
                
                <h2 style="color: #333; text-align: center;">Recuperación de Contraseña</h2>
                
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Hola,<br><br>
                    Has solicitado restablecer tu contraseña para acceder al sistema SENA GDF. Si no te valída, asegurate de no haber pedido varios correos de recuperación
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${enlace}" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block;">
                        Restablecer Contraseña
                    </a>
                </div>
                
                <p style="color: #888; font-size: 14px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                    Este enlace es válido por <b>15 minutos</b>.<br>
                    Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
                </p>
                
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #aaa;">
                    &copy; ${new Date().getFullYear()} SENA GDF. Todos los derechos reservados.
                </div>
            </div>
        </div>
        `,
    });

    logger.info('AUTH_SVC', 'Email de recuperacion enviado exitosamente');
    return { success: true };

};

exports.validarTokenRecuperacion = async (tokenPlano) => {
    const [tokens] = await db.query(
        `SELECT id_recuperacion, token, fecha_solicitud 
     FROM recuperacion_contrasena 
     WHERE fecha_restablecimiento IS NULL`
    );

    for (const registro of tokens) {
        const coincide = await bcrypt.compare(tokenPlano, registro.token);
        if (coincide) {
            const esValido =
                new Date() - new Date(registro.fecha_solicitud) <= 15 * 60 * 1000;

            if (!esValido) {
                throw new Error("El token ha expirado");
            }

            return registro.id_recuperacion;
        }
    }

    throw new Error("Token inválido");
};

exports.cambiarPassword = async (tokenPlano, nuevaContrasena) => {
    try {
        const [tokens] = await db.query(
            `SELECT id_recuperacion, token, fecha_solicitud, usuario_id_usuario 
             FROM recuperacion_contrasena 
             WHERE fecha_restablecimiento IS NULL`
        );

        let registroEncontrado = null;

        for (const registro of tokens) {
            const coincide = await bcrypt.compare(tokenPlano, registro.token);
            if (coincide) {
                const esValido = new Date() - new Date(registro.fecha_solicitud) <= 15 * 60 * 1000;
                if (!esValido) {
                    throw new Error("El token ha expirado");
                }
                registroEncontrado = registro;
                break;
            }
        }

        if (!registroEncontrado) {
            throw new Error("Token inválido");
        }
        const hash = await bcrypt.hash(nuevaContrasena, 10);

        await db.query(
            "UPDATE usuario SET contrasena = ?, ultima_actualizacion = NOW() WHERE id_usuario = ?",
            [hash, registroEncontrado.usuario_id_usuario]
        );
        // Esto antes solo invalidaba el token recien usado pero no los tokens anteriores

        // await db.query(
        //     "UPDATE recuperacion_contrasena SET fecha_restablecimiento = NOW() WHERE id_recuperacion = ?",
        //     [registroEncontrado.id_recuperacion]
        // );

        // Ahora invalidaremos todos los tokens antiguos que estén activos para que no puedan usarlos
        await db.query(
            `UPDATE recuperacion_contrasena 
            SET fecha_restablecimiento = NOW() 
            WHERE usuario_id_usuario = ? 
            AND fecha_restablecimiento IS NULL`,
            [registroEncontrado.usuario_id_usuario]
        );
        // Ahora solo hay un token activo por usuario y no varios para evitar cambios de contraseña repentinos o por hackeos de correos
        return { success: true };

    } catch (error) {
        logger.error('AUTH_SVC', 'Error en cambiarPassword', { error: error.message });
        throw error;
    }

};
