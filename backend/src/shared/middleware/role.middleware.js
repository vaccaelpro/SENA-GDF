exports.isAdmin = (req, res, next) => {
    // Aquí verificarías si el usuario tiene rol ADMIN
    // req.usuario se llenaría en auth.middleware
    /*
    if (req.usuario && req.usuario.rol === 'ADMIN') {
        next();
        return;
    }
    res.status(403).json({ message: 'Requiere rol de Administrador' });
    */
    next();
};

exports.isAprendiz = (req, res, next) => {
    // Aquí verificarías si el usuario tiene rol USUARIO/APRENDIZ
    /*
    if (req.usuario && req.usuario.rol === 'USUARIO') {
        next();
        return;
    }
    res.status(403).json({ message: 'Requiere rol de Aprendiz' });
    */
    next();
};
