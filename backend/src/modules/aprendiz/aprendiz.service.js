const db = require('../../config/database')

exports.getTestMessage = async () => {
    return { message: "Módulo de aprendiz funcionando correctamente (Desde Servicio)" };
}
