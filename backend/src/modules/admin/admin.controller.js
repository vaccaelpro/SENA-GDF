const service = require('./admin.service')

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await service.listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error("ERROR LISTAR:", error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}

exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.actualizarUsuario(id, req.body);
        res.json(result);
    } catch (error) {
        console.error("ERROR ACTUALIZAR:", error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
}

exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.eliminarUsuario(id);
        res.json(result);
    } catch (error) {
        console.error("ERROR ELIMINAR:", error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
}

exports.test = async (req, res) => {
    try {
        const result = await service.getTestMessage();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

exports.registrarExportacion = async (req, res) => {
    try {
        console.log("RECIBIENDO SOLICITUD DE EXPORTACION:", req.body);
        const result = await service.registrarExportacion(req.body);
        console.log("EXPORTACION REGISTRADA CON EXITO:", result);
        res.json(result);
    } catch (error) {
        console.error("ERROR REGISTRAR EXPORTACION (CONTROLLER):", error);
        res.status(500).json({ error: 'Error al registrar la exportación' });
    }
}
