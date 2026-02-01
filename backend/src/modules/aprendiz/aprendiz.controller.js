const service = require('./aprendiz.service')

exports.test = async (req, res) => {
    try {
        const result = await service.getTestMessage();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

// Aquí irán las funciones para:
// exports.verNovedades = ...
// exports.verMetas = ...
