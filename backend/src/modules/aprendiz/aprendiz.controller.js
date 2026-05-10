const service = require('./aprendiz.service')

exports.test = async (req, res) => {
    try {
        const result = await service.getTestMessage();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

exports.obtenerMiGrupo = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const grupo = await service.obtenerMiGrupo(id_usuario);
        if (!grupo) {
            return res.status(404).json({ error: 'No tienes un grupo asignado' });
        }
        res.json(grupo);
    } catch (error) {
        console.error("ERROR MI GRUPO:", error);
        res.status(500).json({ error: 'Error al obtener mi grupo' });
    }
}

exports.obtenerMiembrosMiGrupo = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const miembros = await service.obtenerMiembrosMiGrupo(id_usuario);
        res.json(miembros);
    } catch (error) {
        console.error("ERROR MIEMBROS MI GRUPO:", error);
        res.status(500).json({ error: 'Error al obtener miembros' });
    }
}

exports.obtenerMensajesMiGrupo = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const mensajes = await service.obtenerMensajesMiGrupo(id_usuario);
        res.json(mensajes);
    } catch (error) {
        console.error("ERROR MENSAJES MI GRUPO:", error);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
}
