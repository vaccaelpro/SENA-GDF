const fs = require('fs');
const path = require('path');
const db = require('../../config/database');
const logger = require('../../utils/logger');
const { analizarDocumentoMetroConGemini } = require('../../utils/geminiVision.service');
const { validarUbicacion } = require('../../utils/geoValidation.service');

const CARPETA_UPLOADS = path.join(__dirname, '../../../uploads/documentos_metro');

// Asegurar que la carpeta de almacenamiento exista
if (!fs.existsSync(CARPETA_UPLOADS)) {
  fs.mkdirSync(CARPETA_UPLOADS, { recursive: true });
}

/**
 * Procesa la subida y auditoría con IA de un formulario del Metro
 */
exports.procesarDocumentoMetro = async ({ usuarioId, archivoBuffer, nombreOriginal, mimeType }) => {
  if (!archivoBuffer || archivoBuffer.length === 0) {
    throw new Error('El archivo cargado está vacío o no es válido');
  }

  // Generar nombre de archivo único y seguro
  const extension = path.extname(nombreOriginal) || (mimeType.includes('pdf') ? '.pdf' : '.jpg');
  const timestamp = Date.now();
  const nombreGuardado = `metro_${usuarioId}_${timestamp}${extension}`;
  const rutaCompleta = path.join(CARPETA_UPLOADS, nombreGuardado);
  const rutaRelativa = `/uploads/documentos_metro/${nombreGuardado}`;

  // Guardar archivo en disco
  fs.writeFileSync(rutaCompleta, archivoBuffer);
  logger.info('DOCUMENTO_METRO', `Archivo guardado en ${rutaCompleta}`);

  // Convertir a base64 para Gemini
  const base64Data = archivoBuffer.toString('base64');

  // 1. Ejecutar análisis multimodal con Gemini Vision
  const { modeloUsado, resultado: resultadoIA } = await analizarDocumentoMetroConGemini({
    base64Data,
    mimeType,
  });

  const datos = resultadoIA.datos_extraidos || {};
  const firmas = resultadoIA.verificacion_firmas || {};
  const evaluacion = resultadoIA.evaluacion_general || {};

  // 2. Validación cruzada geográfica (OpenStreetMap + Nomenclatura metropolitana)
  let geoResultado = { coherente: false, detalles: [] };
  if (datos.direccion || datos.municipio || datos.barrio) {
    geoResultado = await validarUbicacion({
      direccion: datos.direccion,
      barrio: datos.barrio,
      municipio: datos.municipio,
    });
  }

  // Si hay problemas de ubicación, anexarlos a las observaciones
  if (!geoResultado.coherente && geoResultado.detalles.length > 0) {
    evaluacion.inconsistencias = evaluacion.inconsistencias || [];
    evaluacion.inconsistencias.push(...geoResultado.detalles);
    evaluacion.instrucciones_correccion_para_usuario = evaluacion.instrucciones_correccion_para_usuario || [];
    evaluacion.instrucciones_correccion_para_usuario.push(
      'Verifica que la dirección de residencia, barrio y municipio correspondan al Área Metropolitana del Valle de Aburrá.'
    );
  }

  // Determinar estado final de validación
  let estadoFinal = evaluacion.estado || 'REQUIERE_REVISION';
  if (
    !firmas.firma_coherente_con_edad ||
    !datos.tarjeta_civica ||
    !datos.numero_documento ||
    !geoResultado.coherente
  ) {
    if (estadoFinal === 'APROBADO') {
      estadoFinal = 'REQUIERE_REVISION';
    }
  }

  // Preparar observaciones en formato JSON para la base de datos
  const observacionesJSON = JSON.stringify({
    modeloUsado,
    evaluacion,
    verificacion_firmas: firmas,
    validacion_geografica: geoResultado,
  });

  const resultadoRawJSON = JSON.stringify(resultadoIA);

  // 3. Guardar en base de datos
  const sqlInsert = `
    INSERT INTO solicitudes_beneficio_metro (
      usuario_id_usuario,
      ruta_archivo,
      nombre_archivo_original,
      tarjeta_civica,
      tipo_documento,
      numero_documento,
      nombre_completo,
      direccion,
      municipio,
      barrio,
      estrato,
      telefono,
      email,
      fecha_nacimiento,
      institucion_educativa,
      grado_seccion_facultad,
      motivo_solicitud,
      tiene_firma_estudiante,
      tiene_firma_acudiente,
      direccion_coherente,
      estado_validacion,
      puntaje_confianza,
      observaciones_ia,
      resultado_ia_raw,
      fecha_subida
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  // Sanitizar tipo de documento
  let tipoDocLimpio = String(datos.tipo_documento || 'OTRO').replace(/[^A-Za-z]/g, '').toUpperCase();
  if (!['RC', 'TI', 'CC', 'OTRO'].includes(tipoDocLimpio)) {
    tipoDocLimpio = 'OTRO';
  }

  // Sanitizar estrato
  const estratoParsed = parseInt(datos.estrato, 10);
  const estratoFinal = isNaN(estratoParsed) ? null : estratoParsed;

  const idUsuarioInt = parseInt(usuarioId, 10);

  const valores = [
    idUsuarioInt,
    rutaRelativa,
    nombreOriginal,
    datos.tarjeta_civica ? String(datos.tarjeta_civica).trim() : null,
    tipoDocLimpio,
    datos.numero_documento ? String(datos.numero_documento).trim() : null,
    datos.nombre_completo ? String(datos.nombre_completo).trim() : null,
    datos.direccion ? String(datos.direccion).trim() : null,
    datos.municipio ? String(datos.municipio).trim() : null,
    datos.barrio ? String(datos.barrio).trim() : null,
    estratoFinal,
    datos.telefono_celular ? String(datos.telefono_celular).trim() : null,
    datos.email ? String(datos.email).trim() : null,
    datos.fecha_nacimiento ? String(datos.fecha_nacimiento).trim() : null,
    datos.institucion_educativa ? String(datos.institucion_educativa).trim() : null,
    datos.grado_seccion_facultad ? String(datos.grado_seccion_facultad).trim() : null,
    datos.motivo_solicitud ? String(datos.motivo_solicitud).trim() : null,
    firmas.firma_estudiante_presente ? 1 : 0,
    firmas.firma_acudiente_presente ? 1 : 0,
    geoResultado.coherente ? 1 : 0,
    estadoFinal,
    Number(evaluacion.puntaje_calidad || 0),
    observacionesJSON,
    resultadoRawJSON,
  ];

  const [insertResult] = await db.query(sqlInsert, valores);
  const idSolicitud = insertResult.insertId;

  logger.info('DOCUMENTO_METRO', `Solicitud registrada exitosamente con ID ${idSolicitud}`, {
    usuarioId,
    estadoFinal,
  });

  return {
    idSolicitud,
    estadoValidacion: estadoFinal,
    puntajeConfianza: evaluacion.puntaje_calidad || 0,
    datosExtraidos: datos,
    verificacionFirmas: firmas,
    validacionGeografica: geoResultado,
    evaluacionGeneral: evaluacion,
    rutaArchivo: rutaRelativa,
  };
};

/**
 * Lista las solicitudes registradas de un aprendiz
 */
exports.listarSolicitudesAprendiz = async (usuarioId) => {
  const sql = `
    SELECT 
      id_solicitud,
      tarjeta_civica,
      tipo_documento,
      numero_documento,
      nombre_completo,
      direccion,
      municipio,
      barrio,
      estrato,
      estado_validacion,
      puntaje_confianza,
      observaciones_ia,
      ruta_archivo,
      nombre_archivo_original,
      fecha_subida,
      fecha_revision
    FROM solicitudes_beneficio_metro
    WHERE usuario_id_usuario = ?
    ORDER BY fecha_subida DESC
  `;

  const [rows] = await db.query(sql, [usuarioId]);
  return rows.map(r => ({
    ...r,
    observaciones_ia: typeof r.observaciones_ia === 'string' ? JSON.parse(r.observaciones_ia) : r.observaciones_ia,
  }));
};

/**
 * Obtiene el detalle de una solicitud
 */
exports.obtenerDetalleSolicitud = async (idSolicitud, usuarioId = null) => {
  let sql = `
    SELECT 
      s.*,
      u.primer_nombre,
      u.primer_apellido,
      u.correo_electronico,
      u.celular AS celular_usuario,
      u.grupo_formacion
    FROM solicitudes_beneficio_metro s
    INNER JOIN usuario u ON s.usuario_id_usuario = u.id_usuario
    WHERE s.id_solicitud = ?
  `;
  const params = [idSolicitud];

  if (usuarioId) {
    sql += ' AND s.usuario_id_usuario = ?';
    params.push(usuarioId);
  }

  const [rows] = await db.query(sql, params);
  if (rows.length === 0) return null;

  const sol = rows[0];
  return {
    ...sol,
    observaciones_ia: typeof sol.observaciones_ia === 'string' ? JSON.parse(sol.observaciones_ia) : sol.observaciones_ia,
    resultado_ia_raw: typeof sol.resultado_ia_raw === 'string' ? JSON.parse(sol.resultado_ia_raw) : sol.resultado_ia_raw,
  };
};

/**
 * Obtiene una solicitud básica por su ID
 */
exports.obtenerSolicitudPorId = async (idSolicitud) => {
  const [rows] = await db.query('SELECT * FROM solicitudes_beneficio_metro WHERE id_solicitud = ?', [idSolicitud]);
  return rows[0] || null;
};

