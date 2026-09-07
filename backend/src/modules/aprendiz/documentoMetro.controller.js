const documentoMetroService = require('./documentoMetro.service');
const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');

/**
 * Analiza un documento escaneado/foto del formulario Metro
 * POST /api/aprendiz/documento-metro/analizar
 */
exports.analizarDocumento = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id || req.user?.id_usuario || req.body?.usuarioId;
    if (!usuarioId) {
      return res.status(400).json({ error: 'No se pudo identificar al usuario aprendiz. Por favor verifica tu sesión.' });
    }

    const { archivoBase64, nombreArchivo, mimeType } = req.body;

    if (!archivoBase64) {
      return res.status(400).json({ error: 'Debes proporcionar la imagen o PDF del documento' });
    }

    // Limpiar prefijo data URL si existe (ej. data:image/jpeg;base64,...)
    const matches = archivoBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let base64Limpio = archivoBase64;
    let mimeDetectado = mimeType || 'image/jpeg';

    if (matches && matches.length === 3) {
      mimeDetectado = matches[1];
      base64Limpio = matches[2];
    }

    const buffer = Buffer.from(base64Limpio, 'base64');

    // Validación de tamaño (máx 10 MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'El archivo excede el tamaño máximo permitido de 10 MB' });
    }

    const resultado = await documentoMetroService.procesarDocumentoMetro({
      usuarioId,
      archivoBuffer: buffer,
      nombreOriginal: nombreArchivo || 'formulario_metro.jpg',
      mimeType: mimeDetectado,
    });

    return res.status(200).json({
      success: true,
      mensaje: 'Documento analizado con éxito por la IA',
      data: resultado,
    });
  } catch (error) {
    logger.error('DOCUMENTO_METRO_CTRL', 'Error al procesar documento', { error: error.message });
    return res.status(500).json({
      error: 'Error al procesar el documento con la IA: ' + error.message,
    });
  }
};

/**
 * Obtiene el historial de documentos subidos por el aprendiz actual
 * GET /api/aprendiz/documento-metro/mis-solicitudes
 */
exports.obtenerMisSolicitudes = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id || req.user?.id_usuario || req.query?.usuarioId;
    if (!usuarioId) {
      return res.status(400).json({ error: 'Identificador de usuario no proporcionado' });
    }

    const solicitudes = await documentoMetroService.listarSolicitudesAprendiz(usuarioId);
    return res.status(200).json(solicitudes);
  } catch (error) {
    logger.error('DOCUMENTO_METRO_CTRL', 'Error al obtener solicitudes', { error: error.message });
    return res.status(500).json({ error: 'Error al obtener el historial de solicitudes' });
  }
};

/**
 * Descarga la plantilla oficial en PDF o imagen del formulario del Metro
 * GET /api/aprendiz/documento-metro/plantilla
 */
exports.descargarPlantilla = async (req, res) => {
  try {
    const rutaPlantillaPdf = path.join(__dirname, '../../../uploads/plantillas/formato_metro_estudiante.pdf');
    const rutaPlantillaJpg = path.join(__dirname, '../../assets/plantillas/formato_metro_plantilla.jpg');

    if (fs.existsSync(rutaPlantillaPdf)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Formato_Inscripcion_Metro_Medellin.pdf"');
      return res.sendFile(rutaPlantillaPdf);
    } else if (fs.existsSync(rutaPlantillaJpg)) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', 'attachment; filename="Formato_Inscripcion_Metro_Medellin.jpg"');
      return res.sendFile(rutaPlantillaJpg);
    } else {
      return res.status(404).json({ error: 'Plantilla oficial no encontrada' });
    }
  } catch (error) {
    logger.error('DOCUMENTO_METRO_CTRL', 'Error al descargar plantilla', { error: error.message });
    return res.status(500).json({ error: 'Error al descargar la plantilla' });
  }
};

/**
 * Permite al aprendiz descargar o visualizar su documento subido
 * GET /api/aprendiz/documento-metro/:id/descargar
 */
exports.descargarArchivo = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id || req.user?.id_usuario || req.query?.usuarioId;
    const { id } = req.params;

    const solicitud = await documentoMetroService.obtenerSolicitudPorId(id);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Si es aprendiz, verificar que le pertenezca
    if (usuarioId && req.usuario?.rol !== 'admin' && String(solicitud.usuario_id_usuario) !== String(usuarioId)) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a este documento' });
    }

    const rutaRelativa = solicitud.ruta_archivo.startsWith('/') ? solicitud.ruta_archivo.slice(1) : solicitud.ruta_archivo;
    const rutaAbsoluta = path.join(__dirname, '../../../', rutaRelativa);

    if (!fs.existsSync(rutaAbsoluta)) {
      return res.status(404).json({ error: 'El archivo físico no se encuentra en el servidor' });
    }

    const nombreDescarga = solicitud.nombre_archivo_original || path.basename(rutaAbsoluta);
    return res.download(rutaAbsoluta, nombreDescarga);
  } catch (error) {
    logger.error('DOCUMENTO_METRO_CTRL', 'Error al descargar archivo aprendiz', { error: error.message });
    return res.status(500).json({ error: 'Error al descargar el archivo' });
  }
};

