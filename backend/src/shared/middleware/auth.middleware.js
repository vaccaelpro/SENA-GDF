const db = require("../../config/database");

// Verificación por token según lo que tenemos de la base de datos

exports.verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token de sesión requerido' 
        });
    }

    const [sesiones] = await db.query(
        `SELECT id_sesion, usuario_id_usuario 
         FROM sesion 
         WHERE token = ? AND activa = 1 AND fecha_expiracion > NOW()`,
        [token]
    );

    if (sesiones.length === 0) {
        return res.status(401).json({ 
            success: false, 
            message: 'Sesión inválida o expirada' 
        });
    }

    req.usuario = {
        id: sesiones[0].usuario_id_usuario,
        token: token
    };

    next();
};