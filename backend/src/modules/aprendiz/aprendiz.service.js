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

// ============= METAS DE AHORRO =============

exports.listarMetas = async (idUsuario) => {
    try {
        const [rows] = await db.query(
            `SELECT id_ahorro, meta, valor_objetivo, monto_ahorrado, fecha_objetivo, color, ultima_actualizacion,
                    usuario_id_usuario
             FROM metas_ahorro
             WHERE usuario_id_usuario = ?
             ORDER BY ultima_actualizacion DESC`,
            [idUsuario]
        );
        return rows;
    } catch (error) {
        console.error("Error en listarMetas:", error);
        throw error;
    }
};

exports.crearMeta = async ({ meta, valor_objetivo, monto_ahorrado = 0, fecha_objetivo, color = '#28a745', usuario_id_usuario }) => {
    try {
        const ahora = new Date();
        const [result] = await db.query(
            `INSERT INTO metas_ahorro (meta, valor_objetivo, monto_ahorrado, fecha_objetivo, color, ultima_actualizacion, usuario_id_usuario)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [meta, valor_objetivo, monto_ahorrado, fecha_objetivo, color, ahora, usuario_id_usuario]
        );
        return { id_ahorro: result.insertId, meta, valor_objetivo, monto_ahorrado, fecha_objetivo, color, ultima_actualizacion: ahora, usuario_id_usuario };
    } catch (error) {
        console.error("Error en crearMeta:", error);
        throw error;
    }
};

exports.editarMeta = async (idAhorro, { meta, valor_objetivo, fecha_objetivo, color }) => {
    try {
        const ahora = new Date();
        await db.query(
            `UPDATE metas_ahorro SET meta = ?, valor_objetivo = ?, fecha_objetivo = ?, color = ?, ultima_actualizacion = ?
             WHERE id_ahorro = ?`,
            [meta, valor_objetivo, fecha_objetivo, color, ahora, idAhorro]
        );
        return { id_ahorro: idAhorro, meta, valor_objetivo, fecha_objetivo, color, ultima_actualizacion: ahora };
    } catch (error) {
        console.error("Error en editarMeta:", error);
        throw error;
    }
};

exports.agregarMonto = async (idAhorro, monto) => {
    try {
        const ahora = new Date();
        // 1. Obtener el usuario_id_usuario de esta meta de ahorro
        const [rows] = await db.query(
            `SELECT usuario_id_usuario FROM metas_ahorro WHERE id_ahorro = ?`,
            [idAhorro]
        );
        if (rows.length === 0) {
            throw new Error("Meta no encontrada");
        }
        const idUsuario = rows[0].usuario_id_usuario;

        // 2. Actualizar el monto ahorrado en la meta de ahorro
        await db.query(
            `UPDATE metas_ahorro SET monto_ahorrado = monto_ahorrado + ?, ultima_actualizacion = ?
             WHERE id_ahorro = ?`,
            [monto, ahora, idAhorro]
        );

        // 3. Registrar este incremento también en la tabla ingresos
        await db.query(
            `INSERT INTO ingresos (monto, fecha_registro, ultima_actualizacion, usuario_id_usuario)
             VALUES (?, ?, ?, ?)`,
            [monto, ahora.toISOString().split('T')[0], ahora, idUsuario]
        );

        return { success: true };
    } catch (error) {
        console.error("Error en agregarMonto:", error);
        throw error;
    }
};

exports.eliminarMeta = async (idAhorro) => {
    try {
        await db.query(`DELETE FROM metas_ahorro WHERE id_ahorro = ?`, [idAhorro]);
        return { success: true };
    } catch (error) {
        console.error("Error en eliminarMeta:", error);
        throw error;
    }
};

// ============= INGRESOS =============

exports.listarIngresos = async (idUsuario) => {
    try {
        const [rows] = await db.query(
            `SELECT id_ingreso, monto, fecha_registro, ultima_actualizacion, usuario_id_usuario
             FROM ingresos
             WHERE usuario_id_usuario = ?
             ORDER BY fecha_registro DESC`,
            [idUsuario]
        );
        return rows;
    } catch (error) {
        console.error("Error en listarIngresos:", error);
        throw error;
    }
};

exports.crearIngreso = async ({ monto, fecha_registro, usuario_id_usuario }) => {
    try {
        const ahora = new Date();
        const [result] = await db.query(
            `INSERT INTO ingresos (monto, fecha_registro, ultima_actualizacion, usuario_id_usuario)
             VALUES (?, ?, ?, ?)`,
            [monto, fecha_registro, ahora, usuario_id_usuario]
        );
        return { id_ingreso: result.insertId, monto, fecha_registro, ultima_actualizacion: ahora, usuario_id_usuario };
    } catch (error) {
        console.error("Error en crearIngreso:", error);
        throw error;
    }
};

exports.eliminarIngreso = async (idIngreso) => {
    try {
        await db.query(`DELETE FROM ingresos WHERE id_ingreso = ?`, [idIngreso]);
        return { success: true };
    } catch (error) {
        console.error("Error en eliminarIngreso:", error);
        throw error;
    }
};

// ============= GASTOS =============

exports.listarGastos = async (idUsuario) => {
    try {
        const [rows] = await db.query(
            `SELECT id_gasto, categoria, monto, fecha_registro, ultima_actualizacion, usuario_id_usuario
             FROM gastos
             WHERE usuario_id_usuario = ?
             ORDER BY fecha_registro DESC`,
            [idUsuario]
        );
        return rows;
    } catch (error) {
        console.error("Error en listarGastos:", error);
        throw error;
    }
};

exports.crearGasto = async ({ categoria, monto, fecha_registro, usuario_id_usuario }) => {
    try {
        const ahora = new Date();
        const [result] = await db.query(
            `INSERT INTO gastos (categoria, monto, fecha_registro, ultima_actualizacion, usuario_id_usuario)
             VALUES (?, ?, ?, ?, ?)`,
            [categoria, monto, fecha_registro, ahora, usuario_id_usuario]
        );
        return { id_gasto: result.insertId, categoria, monto, fecha_registro, ultima_actualizacion: ahora, usuario_id_usuario };
    } catch (error) {
        console.error("Error en crearGasto:", error);
        throw error;
    }
};

exports.eliminarGasto = async (idGasto) => {
    try {
        await db.query(`DELETE FROM gastos WHERE id_gasto = ?`, [idGasto]);
        return { success: true };
    } catch (error) {
        console.error("Error en eliminarGasto:", error);
        throw error;
    }
};

