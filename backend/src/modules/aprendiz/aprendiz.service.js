const db = require('../../config/database');
const logger = require('../../utils/logger');
const { chatConFallback } = require('../../utils/openrouter');


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
        logger.error('APRENDIZ_SVC', 'Error en obtenerMiGrupo', { error: error.message });
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
        logger.error('APRENDIZ_SVC', 'Error en obtenerMiembrosMiGrupo', { error: error.message });
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
        logger.error('APRENDIZ_SVC', 'Error en obtenerMensajesMiGrupo', { error: error.message });
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
        logger.error('APRENDIZ_SVC', 'Error en listarMetas', { error: error.message });
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
        logger.error('APRENDIZ_SVC', 'Error en crearMeta', { error: error.message });
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
        logger.error('APRENDIZ_SVC', 'Error en editarMeta', { error: error.message });
        throw error;
    }

};

exports.agregarMonto = async (idAhorro, monto) => {
    try {
        const ahora = new Date();
        // 1. Obtener el usuario_id_usuario de esta meta de ahorro
        const [rows] = await db.query(
            `SELECT usuario_id_usuario, meta FROM metas_ahorro WHERE id_ahorro = ?`,
            [idAhorro]
        );
        if (rows.length === 0) {
            throw new Error("Meta no encontrada");
        }
        const idUsuario = rows[0].usuario_id_usuario;
        const nombreMeta = rows[0].meta;

        // 2. Actualizar el monto ahorrado en la meta (SUM acumulativo)
        await db.query(
            `UPDATE metas_ahorro SET monto_ahorrado = monto_ahorrado + ?, ultima_actualizacion = ?
             WHERE id_ahorro = ?`,
            [monto, ahora, idAhorro]
        );

        // 3. Registrar este incremento en la tabla ingresos
        // Intentamos con descripcion, si el campo no existe usamos INSERT básico
        try {
            await db.query(
                `INSERT INTO ingresos (monto, fecha_registro, ultima_actualizacion, usuario_id_usuario, descripcion)
                 VALUES (?, ?, ?, ?, ?)`,
                [monto, ahora.toISOString().split('T')[0], ahora, idUsuario, `Ahorro: ${nombreMeta}`]
            );
        } catch (insertErr) {
            // Si falla con descripcion, intentar sin ella
            await db.query(
                `INSERT INTO ingresos (monto, fecha_registro, ultima_actualizacion, usuario_id_usuario)
                 VALUES (?, ?, ?, ?)`,
                [monto, ahora.toISOString().split('T')[0], ahora, idUsuario]
            );
        }

        return { success: true };
    } catch (error) {
        logger.error('APRENDIZ_SVC', 'Error en agregarMonto', { error: error.message });
        throw error;
    }

};

exports.eliminarMeta = async (idAhorro) => {
    try {
        await db.query(`DELETE FROM metas_ahorro WHERE id_ahorro = ?`, [idAhorro]);
        return { success: true };
    } catch (error) {
        logger.error('APRENDIZ_SVC', 'Error en eliminarMeta', { error: error.message });
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
        logger.error('APRENDIZ_SVC', 'Error en listarIngresos', { error: error.message });
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
        logger.error('APRENDIZ_SVC', 'Error en crearIngreso', { error: error.message });
        throw error;
    }

};

exports.eliminarIngreso = async (idIngreso) => {
    try {
        await db.query(`DELETE FROM ingresos WHERE id_ingreso = ?`, [idIngreso]);
        return { success: true };
    } catch (error) {
        logger.error('APRENDIZ_SVC', 'Error en eliminarIngreso', { error: error.message });
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
        logger.error('APRENDIZ_SVC', 'Error en listarGastos', { error: error.message });
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
        logger.error('APRENDIZ_SVC', 'Error en crearGasto', { error: error.message });
        throw error;
    }

};

exports.eliminarGasto = async (idGasto) => {
    try {
        await db.query(`DELETE FROM gastos WHERE id_gasto = ?`, [idGasto]);
        return { success: true };
    } catch (error) {
        logger.error('APRENDIZ_SVC', 'Error en eliminarGasto', { error: error.message });
        throw error;
    }

};


// ============= IA FINANCE =============

/**
 * System Prompt de la IA Finance.
 * Restringe estrictamente las respuestas al dominio de ahorro y educación financiera.
 * @returns {object} Mensaje de sistema con el prompt configurado
 */
function obtenerSystemPrompt() {
    return {
        role: 'system',
        content: `Eres FinanceBot, un asistente de inteligencia artificial especializado EXCLUSIVAMENTE en ahorro personal, administración del dinero y educación financiera para jóvenes aprendices del SENA.

REGLAS ESTRICTAS QUE DEBES SEGUIR SIEMPRE:
1. SOLO responde preguntas relacionadas con: ahorro, presupuesto personal, gestión de deudas, inversión básica, metas de ahorro, regla 50/30/20, fondo de emergencia, control de gastos y educación financiera.
2. Si el usuario pregunta sobre cualquier tema que NO sea finanzas personales o ahorro (recetas, programación, deportes, juegos, política, etc.), responde amablemente: "Solo puedo ayudarte con temas de ahorro, presupuesto y educación financiera. ¿Tienes alguna pregunta sobre cómo mejorar tus finanzas personales?"
3. Cuando el usuario pida videos, tutoriales o recursos educativos sobre un tema de ahorro o finanzas:
   - PRIMERO: Da un consejo detallado, estructurado y práctico explicando paso a paso cómo hacer lo que el usuario pide (por ejemplo, cómo hacer un presupuesto, cómo aplicar la regla 50/30/20, cómo crear un fondo de emergencia, etc.).
   - LUEGO: Incluye al final del mensaje el enlace del video recomendado como un recurso adicional para profundizar el aprendizaje.
   Enlaces de referencia disponibles para usar:
   - Regla 50/30/20: https://www.youtube.com/watch?v=HQzoZfc3GwQ
   - Cómo ahorrar dinero: https://www.youtube.com/watch?v=dG0GFsVNvHo
   - Presupuesto personal desde cero: https://www.youtube.com/watch?v=TM5VzBbxBOE
   - Fondo de emergencia: https://www.youtube.com/watch?v=u59aCMeDCUo
   - Educación financiera básica: https://www.youtube.com/watch?v=8WVoJ6JNLO8
4. Usa un lenguaje claro, amigable y motivador, adaptado a jóvenes aprendices.
5. Responde siempre en español.
6. Sé conciso pero completo. Usa viñetas o listas cuando sea útil para claridad.
7. Si el usuario comparte su situación financiera (ingresos, gastos, balance), analiza y da consejos personalizados y concretos.`,
    };
}

/**
 * Evalúa si el balance financiero del usuario es crítico.
 * Criterios de alerta:
 *   - Balance negativo (gastos > ingresos)
 *   - Balance menor al 20% de los ingresos (gastos > 80% de ingresos)
 * Si se cumple la condición, guarda una alerta automática en la BD.
 *
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<{alertaActiva: boolean, mensaje: string|null, porcentajeBalance: number}>}
 */
exports.evaluarAlertaFinanciera = async (idUsuario) => {
    try {
        // Calcular totales del mes actual
        const mesActual = new Date().toISOString().slice(0, 7); // "YYYY-MM"

        const [[{ totalIngresos }]] = await db.query(
            `SELECT COALESCE(SUM(monto), 0) AS totalIngresos
             FROM ingresos
             WHERE usuario_id_usuario = ?
               AND DATE_FORMAT(fecha_registro, '%Y-%m') = ?`,
            [idUsuario, mesActual]
        );

        const [[{ totalGastos }]] = await db.query(
            `SELECT COALESCE(SUM(monto), 0) AS totalGastos
             FROM gastos
             WHERE usuario_id_usuario = ?
               AND DATE_FORMAT(fecha_registro, '%Y-%m') = ?`,
            [idUsuario, mesActual]
        );

        const balance = Number(totalIngresos) - Number(totalGastos);
        const porcentajeBalance =
            totalIngresos > 0 ? (balance / Number(totalIngresos)) * 100 : 0;

        const alertaActiva =
            balance < 0 || (totalIngresos > 0 && porcentajeBalance < 20);

        if (alertaActiva) {
            const mensajeAlerta =
                balance < 0
                    ? `⚠️ Alerta Financiera: Tus gastos (${Number(totalGastos).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}) superan tus ingresos (${Number(totalIngresos).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}). Ten más cuidado y aprende a administrar mejor tu dinero. Considera revisar tus gastos y crear un presupuesto estricto.`
                    : `⚠️ Alerta Financiera: Tu balance actual es solo el ${porcentajeBalance.toFixed(1)}% de tus ingresos este mes. Ten más cuidado con tus gastos y aprende a administrar mejor tu dinero. Te recomendamos aplicar la regla 50/30/20 para distribuir mejor tus ingresos.`;

            // Verificar si ya existe una alerta para este mes y no duplicarla
            const [alertasExistentes] = await db.query(
                `SELECT id_interaccion FROM interacciones_bot_finanzas
                 WHERE usuario_id_usuario = ?
                   AND tipo = 'ALERTA'
                   AND DATE_FORMAT(fecha_interaccion, '%Y-%m') = ?
                 LIMIT 1`,
                [idUsuario, mesActual]
            );

            if (alertasExistentes.length === 0) {
                const ahora = new Date();
                await db.query(
                    `INSERT INTO interacciones_bot_finanzas
                     (tipo, contenido, fecha_interaccion, ultima_actualizacion, usuario_id_usuario)
                     VALUES ('ALERTA', ?, ?, ?, ?)`,
                    [
                        mensajeAlerta,
                        ahora.toISOString().split('T')[0],
                        ahora,
                        idUsuario,
                    ]
                );
                logger.warn('IA_FINANCE', 'Alerta financiera generada automáticamente', { idUsuario, porcentajeBalance: porcentajeBalance.toFixed(1) });
            }

            return { alertaActiva: true, mensaje: mensajeAlerta, porcentajeBalance };
        }

        return { alertaActiva: false, mensaje: null, porcentajeBalance };
    } catch (error) {
        logger.error('IA_FINANCE', 'Error en evaluarAlertaFinanciera', { error: error.message });
        throw error;
    }
};

/**
 * Procesa un mensaje del usuario con el asistente IA Finance.
 * 1. Recupera historial reciente de la conversación.
 * 2. Añade el contexto financiero del usuario (balance del mes).
 * 3. Llama a OpenRouter con Fallback Loop automático.
 * 4. Guarda el mensaje del usuario y la respuesta de la IA en la BD.
 *
 * @param {object} params
 * @param {number} params.usuarioId - ID del usuario
 * @param {string} params.mensaje - Mensaje enviado por el usuario
 * @returns {Promise<{respuesta: string, modeloUsado: string, alertaFinanciera: object}>}
 */
exports.procesarChatIA = async ({ usuarioId, mensaje }) => {
    if (!mensaje || mensaje.trim().length === 0) {
        throw new Error('El mensaje no puede estar vacío.');
    }

    // Limitar longitud del mensaje para evitar abusos
    const mensajeLimpio = mensaje.trim().slice(0, 1000);

    try {
        // 1. Recuperar historial reciente (últimas 10 interacciones para contexto)
        const [historialRows] = await db.query(
            `SELECT tipo, contenido
             FROM interacciones_bot_finanzas
             WHERE usuario_id_usuario = ?
               AND tipo IN ('CHAT_USER', 'CHAT_IA')
             ORDER BY fecha_interaccion DESC, id_interaccion DESC
             LIMIT 10`,
            [usuarioId]
        );

        // El historial viene en orden DESC, lo invertimos para el contexto
        const historialParaIA = historialRows.reverse().map((row) => ({
            role: row.tipo === 'CHAT_USER' ? 'user' : 'assistant',
            content: row.contenido,
        }));

        // 2. Obtener contexto financiero del mes actual para enriquecer el prompt
        const mesActual = new Date().toISOString().slice(0, 7);
        const [[{ totalIngresos }]] = await db.query(
            `SELECT COALESCE(SUM(monto), 0) AS totalIngresos FROM ingresos
             WHERE usuario_id_usuario = ? AND DATE_FORMAT(fecha_registro, '%Y-%m') = ?`,
            [usuarioId, mesActual]
        );
        const [[{ totalGastos }]] = await db.query(
            `SELECT COALESCE(SUM(monto), 0) AS totalGastos FROM gastos
             WHERE usuario_id_usuario = ? AND DATE_FORMAT(fecha_registro, '%Y-%m') = ?`,
            [usuarioId, mesActual]
        );
        const balanceActual = Number(totalIngresos) - Number(totalGastos);

        // 3. Construir la lista de mensajes para la API
        const mensajesParaAPI = [
            obtenerSystemPrompt(),
            // Contexto financiero como primer mensaje del sistema
            {
                role: 'system',
                content: `Contexto financiero actual del usuario este mes: Ingresos = $${Number(totalIngresos).toLocaleString('es-CO')}, Gastos = $${Number(totalGastos).toLocaleString('es-CO')}, Balance = $${balanceActual.toLocaleString('es-CO')}. Usa este contexto para personalizar tus consejos cuando sea relevante.`,
            },
            // Historial reciente
            ...historialParaIA,
            // Nuevo mensaje del usuario
            { role: 'user', content: mensajeLimpio },
        ];

        // 4. Llamar a OpenRouter con Fallback Loop automático
        const { respuesta, modeloUsado } = await chatConFallback(mensajesParaAPI, 1024);

        // 5. Guardar el mensaje del usuario y la respuesta en la BD
        const ahora = new Date();
        const fechaHoy = ahora.toISOString().split('T')[0];

        await db.query(
            `INSERT INTO interacciones_bot_finanzas
             (tipo, contenido, fecha_interaccion, ultima_actualizacion, usuario_id_usuario)
             VALUES ('CHAT_USER', ?, ?, ?, ?)`,
            [mensajeLimpio, fechaHoy, ahora, usuarioId]
        );

        await db.query(
            `INSERT INTO interacciones_bot_finanzas
             (tipo, contenido, fecha_interaccion, ultima_actualizacion, usuario_id_usuario)
             VALUES ('CHAT_IA', ?, ?, ?, ?)`,
            [respuesta, fechaHoy, ahora, usuarioId]
        );

        // 6. Evaluar si se debe generar una alerta automática de balance
        const alertaFinanciera = await exports.evaluarAlertaFinanciera(usuarioId);

        logger.info('IA_FINANCE', 'Chat procesado exitosamente', { usuarioId, modeloUsado });

        return { respuesta, modeloUsado, alertaFinanciera };
    } catch (error) {
        logger.error('IA_FINANCE', 'Error en procesarChatIA', { error: error.message, usuarioId });
        throw error;
    }
};

/**
 * Recupera el historial completo de interacciones del asistente IA
 * para un usuario (chat, consejos y alertas), ordenado cronológicamente.
 *
 * @param {number} idUsuario - ID del usuario
 * @param {number} [limite=50] - Máximo de registros a recuperar
 * @returns {Promise<Array>} Lista de interacciones
 */
exports.obtenerHistorialIA = async (idUsuario, limite = 50) => {
    try {
        const limiteSanitizado = Math.min(Math.max(parseInt(limite) || 50, 1), 100);
        const [rows] = await db.query(
            `SELECT id_interaccion, tipo, contenido, fecha_interaccion, ultima_actualizacion
             FROM interacciones_bot_finanzas
             WHERE usuario_id_usuario = ?
             ORDER BY fecha_interaccion ASC, id_interaccion ASC
             LIMIT ?`,
            [idUsuario, limiteSanitizado]
        );
        return rows;
    } catch (error) {
        logger.error('IA_FINANCE', 'Error en obtenerHistorialIA', { error: error.message });
        throw error;
    }
};
