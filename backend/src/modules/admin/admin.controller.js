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
exports.crearGrupo = async (req, res) => {
    try {
        const { nombre, descripcion, tipo_apoyo } = req.body;
        if (!nombre || !tipo_apoyo) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const result = await service.crearGrupo(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("ERROR CREAR GRUPO:", error);
        res.status(500).json({ error: 'Error al crear el grupo' });
    }
}

exports.listarGrupos = async (req, res) => {
    try {
        const grupos = await service.listarGrupos();
        res.json(grupos);
    } catch (error) {
        console.error("ERROR LISTAR GRUPOS:", error);
        res.status(500).json({ error: 'Error al obtener los grupos' });
    }
}

exports.obtenerMensajesGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const mensajes = await service.obtenerMensajesGrupo(id);
        res.json(mensajes);
    } catch (error) {
        console.error("ERROR OBTENER MENSAJES:", error);
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
        console.error("ERROR ENVIAR MENSAJE:", error);
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
        res.json(result);
    } catch (error) {
        console.error("ERROR ACTUALIZAR GRUPO:", error);
        res.status(500).json({ error: 'Error al actualizar el grupo' });
    }
}

exports.eliminarGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.eliminarGrupo(id);
        res.json(result);
    } catch (error) {
        console.error("ERROR ELIMINAR GRUPO:", error);
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
        console.error("ERROR ACTUALIZAR MENSAJE:", error);
        res.status(500).json({ error: 'Error al actualizar el mensaje' });
    }
}

exports.eliminarMensajeGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.eliminarMensajeGrupo(id);
        res.json(result);
    } catch (error) {
        console.error("ERROR ELIMINAR MENSAJE:", error);
        res.status(500).json({ error: 'Error al eliminar el mensaje' });
    }
}

exports.obtenerDetalleGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const grupo = await service.obtenerDetalleGrupo(id);
        res.json(grupo);
    } catch (error) {
        console.error("ERROR OBTENER DETALLE GRUPO:", error);
        res.status(500).json({ error: 'Error al obtener el detalle del grupo' });
    }
}

exports.obtenerMiembrosGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const miembros = await service.obtenerMiembrosGrupo(id);
        res.json(miembros);
    } catch (error) {
        console.error("ERROR OBTENER MIEMBROS:", error);
        res.status(500).json({ error: 'Error al obtener miembros del grupo' });
    }
}

// =================== COMUNICADOS / NOVEDADES ===================

exports.listarComunicadosPublicos = async (req, res) => {
    try {
        const comunicados = await service.listarComunicadosPublicos();
        res.json(comunicados);
    } catch (error) {
        console.error('ERROR LISTAR COMUNICADOS PUBLICOS:', error);
        res.status(500).json({ error: 'Error al obtener comunicados' });
    }
};

exports.listarComunicadosAdmin = async (req, res) => {
    try {
        const comunicados = await service.listarComunicadosAdmin();
        res.json(comunicados);
    } catch (error) {
        console.error('ERROR LISTAR COMUNICADOS ADMIN:', error);
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
        console.error('ERROR OBTENER COMUNICADO:', error);
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
        res.status(201).json(result);
    } catch (error) {
        console.error('ERROR CREAR COMUNICADO:', error);
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
        res.json(result);
    } catch (error) {
        console.error('ERROR ACTUALIZAR COMUNICADO:', error);
        res.status(500).json({ error: 'Error al actualizar comunicado' });
    }
};

exports.eliminarComunicado = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.eliminarComunicado(id);
        res.json(result);
    } catch (error) {
        console.error('ERROR ELIMINAR COMUNICADO:', error);
        res.status(500).json({ error: 'Error al eliminar comunicado' });
    }
};

