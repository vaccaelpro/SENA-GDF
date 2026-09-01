// Cambiamos a JWT para que no sea tan lento las query del backend
// Así no tenemos que hacer consultas a la base de datos, esto optimiza los query

const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token de sesión requerido",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = {
            id: decoded.id,
            rol: decoded.rol,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado",
        });
    }
};