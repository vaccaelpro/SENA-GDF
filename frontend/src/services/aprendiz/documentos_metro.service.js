import api from "../api";

const BASE = "/aprendiz/documento-metro";

/**
 * Envía el documento en Base64 para ser analizado por la IA (Gemini Vision + Nomenclatura)
 * @param {string} archivoBase64 - Datos del archivo en base64
 * @param {string} nombreArchivo - Nombre original del archivo
 * @param {string} mimeType - Tipo MIME (image/jpeg, etc.)
 * @param {number} usuarioId - ID del usuario aprendiz autenticado
 */
export const analizarDocumentoMetro = async (archivoBase64, nombreArchivo, mimeType, usuarioId) => {
  const idUsuario = usuarioId || JSON.parse(localStorage.getItem("usuario") || "{}").id_usuario;
  const response = await api.post(
    `${BASE}/analizar`,
    { archivoBase64, nombreArchivo, mimeType, usuarioId: idUsuario },
    { timeout: 120000 } // 120s para procesamiento de visión multimodal
  );
  return response.data;
};

/**
 * Obtiene el historial de documentos enviados por el aprendiz autenticado
 */
export const obtenerMisSolicitudesMetro = async (usuarioId) => {
  const idUsuario = usuarioId || JSON.parse(localStorage.getItem("usuario") || "{}").id_usuario;
  const response = await api.get(`${BASE}/mis-solicitudes`, {
    params: { usuarioId: idUsuario },
  });
  return response.data;
};

/**
 * Devuelve la URL directa para descargar la plantilla oficial
 */
export const obtenerUrlPlantillaMetro = () => {
  const base = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
  return `${base}${BASE}/plantilla`;
};

/**
 * Devuelve la URL directa para descargar el documento del aprendiz
 */
export const obtenerUrlDescargaMetroAprendiz = (idSolicitud) => {
  const base = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
  const token = localStorage.getItem("token") || "";
  return `${base}${BASE}/${idSolicitud}/descargar${token ? `?token=${encodeURIComponent(token)}` : ""}`;
};

/**
 * Descarga el archivo del aprendiz vía Blob para evitar problemas de CORS o sesión
 */
export const descargarArchivoMetroAprendizBlob = async (idSolicitud, nombreSugerido) => {
  const response = await api.get(`${BASE}/${idSolicitud}/descargar`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreSugerido || `mi_documento_metro_${idSolicitud}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

