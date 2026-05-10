const db = require('../../config/database')

exports.getTestMessage = async () => {
    return { message: "Módulo de aprendiz funcionando correctamente (Desde Servicio)" };
}

exports.obtenerMiGrupo = async (usuarioId) => {
    try {
        const [usuario] = await db.query("SELECT tipo_apoyo FROM usuario WHERE id_usuario = ?", [usuarioId]);
        if (usuario.length === 0 || !usuario[0].tipo_apoyo) return null;

        const tipoApoyo = usuario[0].tipo_apoyo;

        const [grupo] = await db.query(
            "SELECT * FROM grupos WHERE tipo_apoyo = ? LIMIT 1",
            [tipoApoyo]
        );
        
        if (grupo.length === 0) return null;

        return grupo[0];
    } catch (error) {
        console.error("Error en obtenerMiGrupo:", error);
        throw error;
    }
};

exports.obtenerMiembrosMiGrupo = async (usuarioId) => {
    try {
        const [usuario] = await db.query("SELECT tipo_apoyo FROM usuario WHERE id_usuario = ?", [usuarioId]);
        if (usuario.length === 0 || !usuario[0].tipo_apoyo) return [];

        const tipoApoyo = usuario[0].tipo_apoyo;

        const [rows] = await db.query(
            "SELECT id_usuario, primer_nombre, primer_apellido, grupo_formacion FROM usuario WHERE tipo_apoyo = ? AND rol = 'USUARIO'",
            [tipoApoyo]
        );
        return rows;
    } catch (error) {
        console.error("Error en obtenerMiembrosMiGrupo:", error);
        throw error;
    }
};

exports.obtenerMensajesMiGrupo = async (usuarioId) => {
    try {
        const [usuario] = await db.query("SELECT tipo_apoyo FROM usuario WHERE id_usuario = ?", [usuarioId]);
        if (usuario.length === 0 || !usuario[0].tipo_apoyo) return [];

        const tipoApoyo = usuario[0].tipo_apoyo;

        const [grupo] = await db.query("SELECT id_grupo FROM grupos WHERE tipo_apoyo = ?", [tipoApoyo]);
        if (grupo.length === 0) return [];

        const grupoId = grupo[0].id_grupo;

        const [rows] = await db.query(
            `SELECT m.id_mensaje, m.mensaje, m.fecha_envio, m.usuario_id, u.primer_nombre, u.primer_apellido, u.rol 
            FROM chat_grupo m 
            JOIN usuario u ON m.usuario_id = u.id_usuario 
            WHERE m.grupo_id = ? 
            ORDER BY m.fecha_envio ASC`,
            [grupoId]
        );
        return rows;
    } catch (error) {
        console.error("Error en obtenerMensajesMiGrupo:", error);
        throw error;
    }
};
