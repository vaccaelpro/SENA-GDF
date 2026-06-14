/**
 * Servicio de Grupos (Admin)
 * Maneja creación, listado, actualización y eliminación de grupos de apoyo,
 * así como mensajes y miembros de cada grupo.
 */
import api from "../api";

const BASE = "/admin/grupos";

// ─── GRUPOS ─────────────────────────────────────────────────────────────────

/** Obtener todos los grupos con conteo de miembros */
export const listarGrupos = async () => {
  const res = await api.get(BASE);
  return res.data;
};

/** Crear un nuevo grupo de apoyo */
export const crearGrupo = async (data) => {
  const res = await api.post(BASE, data);
  return res.data;
};

/** Actualizar nombre y descripción de un grupo */
export const actualizarGrupo = async (id, data) => {
  const res = await api.put(`${BASE}/${id}`, data);
  return res.data;
};

/** Eliminar un grupo y sus relaciones */
export const eliminarGrupo = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};

/** Obtener el detalle completo de un grupo por ID */
export const obtenerDetalleGrupo = async (id) => {
  const res = await api.get(`${BASE}/${id}`);
  return res.data;
};

/** Obtener los miembros de un grupo específico */
export const obtenerMiembrosGrupo = async (id) => {
  const res = await api.get(`${BASE}/${id}/miembros`);
  return res.data;
};

// ─── MENSAJES ────────────────────────────────────────────────────────────────

/** Obtener mensajes del chat de un grupo */
export const obtenerMensajesGrupo = async (id) => {
  const res = await api.get(`${BASE}/${id}/mensajes`);
  return res.data;
};

/** Enviar un mensaje al chat de un grupo */
export const enviarMensajeGrupo = async (id, data) => {
  const res = await api.post(`${BASE}/${id}/mensajes`, data);
  return res.data;
};

/** Editar un mensaje del chat */
export const actualizarMensaje = async (msgId, mensaje) => {
  const res = await api.put(`/admin/mensajes/${msgId}`, { mensaje });
  return res.data;
};

/** Eliminar un mensaje del chat */
export const eliminarMensaje = async (msgId) => {
  const res = await api.delete(`/admin/mensajes/${msgId}`);
  return res.data;
};
