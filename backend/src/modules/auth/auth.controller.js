const service = require("./auth.service");

exports.login = async (req, res) => {
    try {
        const { tipo_documento, documento, contrasena } = req.body;

        if (!tipo_documento || !documento || !contrasena) {
            return res.status(400).json({
                success: false,
                message: "Faltan campos obligatorios para el inicio de sesión",
            });
        }

        const resultado = await service.validarLogin(tipo_documento, documento, contrasena);

        if (resultado.error) {
            return res.status(401).json({
                success: false,
                message: resultado.message,
            });
        }

        res.json({
            success: true,
            message: "Login exitoso",
            usuario: resultado.usuario,
            rol: resultado.usuario.rol,
        });

    } catch (error) {
        console.error("ERROR LOGIN:", error);
        res.status(500).json({
            success: false,
            message: "Error del servidor al intentar iniciar sesión",
        });
    }
};

exports.register = async (req, res) => {
    try {
        const {
            primer_nombre,
            primer_apellido,
            tipo_documento,
            documento,
            correo_electronico,
            contrasena,
            grupo_formacion,
        } = req.body;

        if (
            !primer_nombre ||
            !primer_apellido ||
            !tipo_documento ||
            !documento ||
            !correo_electronico ||
            !contrasena ||
            !grupo_formacion
        ) {
            return res.status(400).json({
                success: false,
                message: "Los campos marcados como obligatorios son necesarios (Nombres, Apellidos, Documento, Correo, Password y Ficha)",
            });
        }

        const resultado = await service.registrarUsuario(req.body);

        if (resultado.error) {
            return res.status(400).json({
                success: false,
                message: resultado.message,
            });
        }

        res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente",
        });

    } catch (error) {
        console.error("ERROR REGISTER:", error);
        res.status(500).json({
            success: false,
            message: "Error al procesar el registro del usuario",
        });
    }
};

exports.recuperarPassword = async (req, res) => {
    try {
        const { correo } = req.body;

        if (!correo) {
            return res.status(400).json({ message: "Correo requerido" });
        }

        await service.generarTokenRecuperacion(correo);

        res.json({ message: "Correo de recuperación enviado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Error al recuperar contraseña" });
    }
};

exports.restablecerPassword = async (req, res) => {
    try {
        const { token, nuevaContrasena } = req.body;

        await service.cambiarPassword(token, nuevaContrasena);

        res.json({ message: "Contraseña actualizada" });

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: "Token inválido o expirado" });
    }
};
