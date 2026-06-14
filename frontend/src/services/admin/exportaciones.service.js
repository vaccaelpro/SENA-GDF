/**
 * Servicio de Exportaciones (Admin)
 * Registra en la base de datos cada archivo generado/exportado.
 */
import api from "../api";

/**
 * Registrar una exportación realizada por un administrador.
 * @param {string} nombre_archivo - Nombre del archivo generado
 * @param {number} usuario_id_usuario - ID del admin que exporta
 * @param {string} tipo_exportacion - "finanzas" | "personal" | etc.
 */
export const registrarExportacion = async (nombre_archivo, usuario_id_usuario, tipo_exportacion) => {
  const res = await api.post("/admin/exportaciones", {
    nombre_archivo,
    usuario_id_usuario,
    tipo_exportacion,
  });
  return res.data;
};
