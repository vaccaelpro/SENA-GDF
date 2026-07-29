const service = require('./admin.service');
const logger = require('../../utils/logger');


exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await service.listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        logger.error('ADMIN', 'Error al listar usuarios', { error: error.message });
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}


exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.actualizarUsuario(id, req.body);
        logger.info('ADMIN', 'Usuario actualizado', { id_usuario: id });
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al actualizar usuario', { error: error.message });
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
}


exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.eliminarUsuario(id);
        logger.info('ADMIN', 'Usuario eliminado', { id_usuario: id });
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al eliminar usuario', { error: error.message });
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
        logger.info('ADMIN', 'Solicitud de exportacion recibida', { tipo: req.body.tipo_exportacion });
        const result = await service.registrarExportacion(req.body);
        logger.info('ADMIN', 'Exportacion registrada', { id: result.id, tipo: req.body.tipo_exportacion });
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al registrar exportacion', { error: error.message });
        res.status(500).json({ error: 'Error al registrar la exportación' });
    }
}

exports.obtenerFinanzasGenerales = async (req, res) => {
    try {
        const data = await service.obtenerFinanzasGenerales();
        res.json(data);
    } catch (error) {
        logger.error('ADMIN', 'Error al obtener finanzas generales', { error: error.message });
        res.status(500).json({ error: 'Error al obtener finanzas generales' });
    }
};


exports.crearGrupo = async (req, res) => {
    try {
        const { nombre, descripcion, tipo_apoyo } = req.body;
        if (!nombre || !tipo_apoyo) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const result = await service.crearGrupo(req.body);
        logger.info('ADMIN', 'Grupo creado', { nombre, tipo_apoyo, usuarios_agregados: result.usuarios_agregados });
        res.status(201).json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al crear grupo', { error: error.message });
        res.status(500).json({ error: 'Error al crear el grupo' });
    }
}


exports.listarGrupos = async (req, res) => {
    try {
        const grupos = await service.listarGrupos();
        res.json(grupos);
    } catch (error) {
        logger.error('ADMIN', 'Error al listar grupos', { error: error.message });
        res.status(500).json({ error: 'Error al obtener los grupos' });
    }
}


exports.obtenerMensajesGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const mensajes = await service.obtenerMensajesGrupo(id);
        res.json(mensajes);
    } catch (error) {
        logger.error('ADMIN', 'Error al obtener mensajes del grupo', { error: error.message });
        res.status(500).json({ error: 'Error al obtener mensajes del grupo' });
    }
}


exports.enviarMensajeGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario_id, mensaje } = req.body;
        if (!usuario_id || !mensaje) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const result = await service.enviarMensajeGrupo(id, usuario_id, mensaje);
        res.status(201).json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al enviar mensaje al grupo', { error: error.message });
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
}


exports.actualizarGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        if (!nombre || !descripcion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const result = await service.actualizarGrupo(id, nombre, descripcion);
        logger.info('ADMIN', 'Grupo actualizado', { id_grupo: id });
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al actualizar grupo', { error: error.message });
        res.status(500).json({ error: 'Error al actualizar el grupo' });
    }
}


exports.eliminarGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.eliminarGrupo(id);
        logger.info('ADMIN', 'Grupo eliminado', { id_grupo: id });
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al eliminar grupo', { error: error.message });
        res.status(500).json({ error: 'Error al eliminar el grupo' });
    }
}


exports.actualizarMensajeGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const { mensaje } = req.body;
        if (!mensaje) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const result = await service.actualizarMensajeGrupo(id, mensaje);
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al actualizar mensaje del grupo', { error: error.message });
        res.status(500).json({ error: 'Error al actualizar el mensaje' });
    }
}


exports.eliminarMensajeGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.eliminarMensajeGrupo(id);
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al eliminar mensaje del grupo', { error: error.message });
        res.status(500).json({ error: 'Error al eliminar el mensaje' });
    }
}


exports.obtenerDetalleGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const grupo = await service.obtenerDetalleGrupo(id);
        res.json(grupo);
    } catch (error) {
        logger.error('ADMIN', 'Error al obtener detalle del grupo', { error: error.message });
        res.status(500).json({ error: 'Error al obtener el detalle del grupo' });
    }
}


exports.obtenerMiembrosGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const miembros = await service.obtenerMiembrosGrupo(id);
        res.json(miembros);
    } catch (error) {
        logger.error('ADMIN', 'Error al obtener miembros del grupo', { error: error.message });
        res.status(500).json({ error: 'Error al obtener miembros del grupo' });
    }
}


// =================== COMUNICADOS / NOVEDADES ===================

exports.listarComunicadosPublicos = async (req, res) => {
    try {
        const comunicados = await service.listarComunicadosPublicos();
        res.json(comunicados);
    } catch (error) {
        logger.error('ADMIN', 'Error al listar comunicados publicos', { error: error.message });
        res.status(500).json({ error: 'Error al obtener comunicados' });
    }
};


exports.listarComunicadosAdmin = async (req, res) => {
    try {
        const comunicados = await service.listarComunicadosAdmin();
        res.json(comunicados);
    } catch (error) {
        logger.error('ADMIN', 'Error al listar comunicados admin', { error: error.message });
        res.status(500).json({ error: 'Error al obtener comunicados' });
    }
};


exports.obtenerComunicadoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const comunicado = await service.obtenerComunicadoPorId(id);
        if (!comunicado) {
            return res.status(404).json({ error: 'Comunicado no encontrado' });
        }
        res.json(comunicado);
    } catch (error) {
        logger.error('ADMIN', 'Error al obtener comunicado', { error: error.message });
        res.status(500).json({ error: 'Error al obtener comunicado' });
    }
};


exports.crearComunicado = async (req, res) => {
    try {
        const { titulo, contenido, categoria, imagen_base64, url_referencia } = req.body;
        if (!titulo || !contenido) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (titulo, contenido)' });
        }

        const usuarioId = req.body.usuario_id || req.usuarioId || 5;

        const result = await service.crearComunicado(req.body, usuarioId);
        logger.info('ADMIN', 'Comunicado creado', { id_comunicado: result.id_comunicado, categoria });
        res.status(201).json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al crear comunicado', { error: error.message });
        res.status(500).json({ error: 'Error al crear comunicado' });
    }
};


exports.actualizarComunicado = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, contenido } = req.body;
        if (!titulo || !contenido) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (titulo, contenido)' });
        }

        const result = await service.actualizarComunicado(id, req.body);
        logger.info('ADMIN', 'Comunicado actualizado', { id_comunicado: id });
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al actualizar comunicado', { error: error.message });
        res.status(500).json({ error: 'Error al actualizar comunicado' });
    }
};


exports.eliminarComunicado = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.eliminarComunicado(id);
        logger.info('ADMIN', 'Comunicado eliminado', { id_comunicado: id });
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al eliminar comunicado', { error: error.message });
        res.status(500).json({ error: 'Error al eliminar comunicado' });
    }
};


// =================== ENCUESTAS ===================

exports.crearEncuesta = async (req, res) => {
    try {
        const { titulo, descripcion, preguntas, admin_id } = req.body;
        if (!titulo || !preguntas || preguntas.length === 0) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const result = await service.crearEncuesta({ titulo, descripcion, preguntas, admin_id: admin_id || 5 });
        logger.info('ADMIN', 'Encuesta creada', { id_formulario: result.id_formulario, preguntas: preguntas.length });
        res.status(201).json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al crear encuesta', { error: error.message });
        res.status(500).json({ error: 'Error al crear encuesta' });
    }
};


exports.listarEncuestas = async (req, res) => {
    try {
        const encuestas = await service.listarEncuestas();
        res.json(encuestas);
    } catch (error) {
        logger.error('ADMIN', 'Error al listar encuestas', { error: error.message });
        res.status(500).json({ error: 'Error al listar encuestas' });
    }
};


exports.obtenerEncuesta = async (req, res) => {
    try {
        const { id } = req.params;
        const encuesta = await service.obtenerEncuestaConPreguntas(id);
        if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });
        res.json(encuesta);
    } catch (error) {
        logger.error('ADMIN', 'Error al obtener encuesta', { error: error.message });
        res.status(500).json({ error: 'Error al obtener encuesta' });
    }
};


exports.eliminarEncuesta = async (req, res) => {
    try {
        const { id } = req.params;
        await service.eliminarEncuesta(id);
        logger.info('ADMIN', 'Encuesta eliminada', { id_formulario: id });
        res.json({ success: true });
    } catch (error) {
        logger.error('ADMIN', 'Error al eliminar encuesta', { error: error.message });
        res.status(500).json({ error: 'Error al eliminar encuesta' });
    }
};


exports.registrarRespuestas = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario_id, respuestas } = req.body;
        if (!usuario_id || !respuestas || respuestas.length === 0) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const result = await service.registrarRespuestas({ encuesta_id: id, usuario_id, respuestas });
        logger.info('ADMIN', 'Respuestas de encuesta registradas', { encuesta_id: id, usuario_id });
        res.json(result);
    } catch (error) {
        logger.error('ADMIN', 'Error al registrar respuestas de encuesta', { error: error.message });
        if (error.message === 'El usuario ya respondió esta encuesta') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al registrar respuestas' });
    }
};


exports.obtenerAnalisisEncuesta = async (req, res) => {
    try {
        const { id } = req.params;
        const analisis = await service.obtenerAnalisisEncuesta(id);
        if (!analisis) return res.status(404).json({ error: 'Encuesta no encontrada' });
        res.json(analisis);
    } catch (error) {
        logger.error('ADMIN', 'Error al obtener analisis de encuesta', { error: error.message });
        res.status(500).json({ error: 'Error al obtener análisis' });
    }
};


exports.verificarRespuestaUsuario = async (req, res) => {
    try {
        const { id, usuario_id } = req.params;
        const yaRespondio = await service.verificarRespuestaUsuario(id, usuario_id);
        res.json({ yaRespondio });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar' });
    }
};
