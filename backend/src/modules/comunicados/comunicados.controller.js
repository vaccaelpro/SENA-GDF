const service = require('./comunicados.service');

// Público: lista de comunicados para aprendices
exports.listarPublicos = async (req, res) => {
  try {
    const comunicados = await service.listarPublicos();
    res.json(comunicados);
  } catch (error) {
    console.error('ERROR LISTAR PUBLICOS:', error);
    res.status(500).json({ error: 'Error al obtener comunicados' });
  }
};

// Admin: lista completa
exports.listarAdmin = async (req, res) => {
  try {
    const comunicados = await service.listarAdmin();
    res.json(comunicados);
  } catch (error) {
    console.error('ERROR LISTAR ADMIN:', error);
    res.status(500).json({ error: 'Error al obtener comunicados' });
  }
};

// Admin: detalle por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const comunicado = await service.obtenerPorId(id);
    if (!comunicado) {
      return res.status(404).json({ error: 'Comunicado no encontrado' });
    }
    res.json(comunicado);
  } catch (error) {
    console.error('ERROR OBTENER:', error);
    res.status(500).json({ error: 'Error al obtener comunicado' });
  }
};

// Admin: crear
exports.crear = async (req, res) => {
  try {
    const { titulo, contenido, categoria, imagen_base64, url_referencia } = req.body;
    if (!titulo || !contenido) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (titulo, contenido)' });
    }

    // Tomar usuario_id del body (enviado desde localStorage en el frontend)
    // Cuando el middleware de auth esté activo, cambiar a req.usuarioId
    const usuarioId = req.body.usuario_id || req.usuarioId || 5;

    const result = await service.crear(req.body, usuarioId);
    res.status(201).json(result);
  } catch (error) {
    console.error('ERROR CREAR:', error);
    res.status(500).json({ error: 'Error al crear comunicado' });
  }
};

// Admin: actualizar
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido } = req.body;
    if (!titulo || !contenido) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (titulo, contenido)' });
    }

    const result = await service.actualizar(id, req.body);
    res.json(result);
  } catch (error) {
    console.error('ERROR ACTUALIZAR:', error);
    res.status(500).json({ error: 'Error al actualizar comunicado' });
  }
};

// Admin: eliminar
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await service.eliminar(id);
    res.json(result);
  } catch (error) {
    console.error('ERROR ELIMINAR:', error);
    res.status(500).json({ error: 'Error al eliminar comunicado' });
  }
};
