const db = require('../../config/database');
const service = require('./aprendiz.service');

exports.test = async (req, res) => {
    try {
        const result = await service.getTestMessage();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

// --- NOTIFICACIONES ---
exports.obtenerNotificaciones = async (req, res) => {
    try {
        const { usuario_id } = req.query;
        if (!usuario_id) return res.status(400).json({ error: 'usuario_id es requerido' });

        // Lógica: Comparar gastos vs ingresos del mes actual
        const [ingresos] = await db.query(`SELECT SUM(monto) as total FROM ingresos WHERE usuario_id_usuario = ? AND MONTH(fecha_registro) = MONTH(CURRENT_DATE()) AND YEAR(fecha_registro) = YEAR(CURRENT_DATE())`, [usuario_id]);
        const [gastos] = await db.query(`SELECT SUM(monto) as total FROM gastos WHERE usuario_id_usuario = ? AND MONTH(fecha_registro) = MONTH(CURRENT_DATE()) AND YEAR(fecha_registro) = YEAR(CURRENT_DATE())`, [usuario_id]);

        const totalIngresos = ingresos[0].total || 0;
        const totalGastos = gastos[0].total || 0;

        if (totalGastos > totalIngresos) {
            // Verificar si ya hay una alerta no leída
            const [alertas] = await db.query(`SELECT id_notificacion FROM notificacion WHERE usuario_id_usuario = ? AND leida = 0 AND mensaje LIKE '%gastando más de lo previsto%'`, [usuario_id]);
            if (alertas.length === 0) {
                await db.query(`INSERT INTO notificacion (usuario_id_usuario, mensaje) VALUES (?, ?)`, [usuario_id, `¡Alerta! Estás gastando más de lo previsto este mes. Tus gastos ($${totalGastos}) superan tus ingresos ($${totalIngresos}).`]);
            }
        }

        const [notificaciones] = await db.query(`SELECT * FROM notificacion WHERE usuario_id_usuario = ? ORDER BY fecha DESC`, [usuario_id]);
        res.json(notificaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

exports.marcarNotificacionLeida = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`UPDATE notificacion SET leida = 1 WHERE id_notificacion = ?`, [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// --- METAS DE AHORRO ---
exports.obtenerMetas = async (req, res) => {
    try {
        const { usuario_id } = req.query;
        const [metas] = await db.query(`SELECT * FROM metas_ahorro WHERE usuario_id_usuario = ?`, [usuario_id]);
        res.json(metas);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

exports.crearMeta = async (req, res) => {
    try {
        const { usuario_id_usuario, meta, valor_objetivo, fecha_objetivo } = req.body;
        if (!meta || valor_objetivo <= 0 || new Date(fecha_objetivo) <= new Date()) {
            return res.status(400).json({ error: 'Datos de meta inválidos' });
        }
        await db.query(`INSERT INTO metas_ahorro (meta, valor_objetivo, fecha_objetivo, ultima_actualizacion, usuario_id_usuario, monto_actual) VALUES (?, ?, ?, NOW(), ?, 0)`, [meta, valor_objetivo, fecha_objetivo, usuario_id_usuario]);
        res.json({ success: true, message: 'Meta creada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

exports.actualizarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const { meta, valor_objetivo, fecha_objetivo } = req.body;
        await db.query(`UPDATE metas_ahorro SET meta=?, valor_objetivo=?, fecha_objetivo=?, ultima_actualizacion=NOW() WHERE id_ahorro=?`, [meta, valor_objetivo, fecha_objetivo, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

exports.eliminarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM metas_ahorro WHERE id_ahorro=?`, [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// --- INGRESOS / APOYOS ---
exports.registrarIngreso = async (req, res) => {
    try {
        const { usuario_id_usuario, monto, meta_id } = req.body;
        if (!monto || monto <= 0) return res.status(400).json({ error: 'Monto inválido' });

        await db.query(`INSERT INTO ingresos (monto, fecha_registro, ultima_actualizacion, usuario_id_usuario) VALUES (?, CURDATE(), NOW(), ?)`, [monto, usuario_id_usuario]);

        if (meta_id) {
            await db.query(`UPDATE metas_ahorro SET monto_actual = monto_actual + ?, ultima_actualizacion=NOW() WHERE id_ahorro = ? AND usuario_id_usuario = ?`, [monto, meta_id, usuario_id_usuario]);
        }
        res.json({ success: true, message: 'Monto registrado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// --- BOT FINANCIERO ---
exports.historialBot = async (req, res) => {
    try {
        const { usuario_id } = req.query;
        const [historial] = await db.query(`SELECT * FROM interacciones_bot_finanzas WHERE usuario_id_usuario = ? ORDER BY id_interaccion ASC`, [usuario_id]);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

exports.chatBot = async (req, res) => {
    try {
        const { usuario_id_usuario, mensaje } = req.body;
        
        // Guardar mensaje del usuario
        await db.query(`INSERT INTO interacciones_bot_finanzas (tipo, contenido, fecha_interaccion, ultima_actualizacion, usuario_id_usuario) VALUES ('CHAT_USUARIO', ?, CURDATE(), NOW(), ?)`, [mensaje, usuario_id_usuario]);

        let respuesta = "No estoy seguro de entenderte del todo. Prueba preguntándome por tu 'resumen', tus 'metas' o pídeme un 'consejo'.";
        const txt = mensaje.toLowerCase();

        if (txt.includes('resumen') || txt.includes('balance') || txt.includes('como voy')) {
            const [ingresos] = await db.query(`SELECT SUM(monto) as total FROM ingresos WHERE usuario_id_usuario = ?`, [usuario_id_usuario]);
            const [gastos] = await db.query(`SELECT SUM(monto) as total FROM gastos WHERE usuario_id_usuario = ?`, [usuario_id_usuario]);
            const bal = (ingresos[0].total || 0) - (gastos[0].total || 0);
            const balFormateado = Number(bal).toLocaleString('es-CO');
            const ingresosFormateado = Number(ingresos[0].total || 0).toLocaleString('es-CO');
            const gastosFormateado = Number(gastos[0].total || 0).toLocaleString('es-CO');
            respuesta = `Tu balance total es $${balFormateado}. Ingresos: $${ingresosFormateado}, Gastos: $${gastosFormateado}.`;
        } else if (txt.includes('meta')) {
            const [metas] = await db.query(`SELECT * FROM metas_ahorro WHERE usuario_id_usuario = ?`, [usuario_id_usuario]);
            if (metas.length === 0) respuesta = "No tienes metas de ahorro registradas.";
            else {
                respuesta = "Tus metas:\n" + metas.map(m => `- ${m.meta}: Llevas $${Number(m.monto_actual).toLocaleString('es-CO')} de $${Number(m.valor_objetivo).toLocaleString('es-CO')}.`).join('\n');
            }
        }

        // Guardar respuesta del bot
        await db.query(`INSERT INTO interacciones_bot_finanzas (tipo, contenido, fecha_interaccion, ultima_actualizacion, usuario_id_usuario) VALUES ('CHAT_BOT', ?, CURDATE(), NOW(), ?)`, [respuesta, usuario_id_usuario]);

        res.json({ respuesta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};
