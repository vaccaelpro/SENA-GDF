import api from "../api";

const BASE = "/admin/documentos-metro";

/**
 * Lista las solicitudes de beneficios Metro para el panel de administración
 */
export const listarDocumentosMetroAdmin = async ({ estado = "TODOS", busqueda = "", limite = 50, offset = 0 } = {}) => {
  const params = {};
  if (estado) params.estado = estado;
  if (busqueda) params.busqueda = busqueda;
  params.limite = limite;
  params.offset = offset;

  const response = await api.get(BASE, { params });
  return response.data;
};

/**
 * Obtiene el detalle de una solicitud
 */
export const obtenerDetalleDocumentoMetroAdmin = async (idSolicitud) => {
  const response = await api.get(`${BASE}/${idSolicitud}`);
  return response.data;
};

/**
 * Actualiza el estado de una solicitud (APROBADO, REQUIERE_REVISION, RECHAZADO)
 */
export const actualizarEstadoDocumentoMetroAdmin = async (idSolicitud, nuevoEstado) => {
  const response = await api.put(`${BASE}/${idSolicitud}/estado`, { nuevoEstado });
  return response.data;
};

/**
 * Obtiene la URL para descargar el archivo físico subido (con token en query)
 */
export const obtenerUrlDescargaMetroAdmin = (idSolicitud) => {
  const base = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
  const token = localStorage.getItem("token") || "";
  return `${base}${BASE}/${idSolicitud}/descargar${token ? `?token=${encodeURIComponent(token)}` : ""}`;
};

/**
 * Descarga el archivo vía Axios con autenticación en blob para evitar problemas de sesión
 */
export const descargarArchivoMetroBlob = async (idSolicitud, nombreSugerido) => {
  const response = await api.get(`${BASE}/${idSolicitud}/descargar`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreSugerido || `documento_metro_${idSolicitud}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
