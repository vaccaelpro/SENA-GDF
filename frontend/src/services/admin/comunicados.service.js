/**
 * Servicio de Comunicados / Novedades (Admin)
 * Maneja creación, edición, listado y eliminación de comunicados publicados.
 */
import api from "../api";

const BASE = "/admin/comunicados";

/** Listar comunicados públicos (para el aprendiz) */
export const listarPublicos = async () => {
  const res = await api.get(BASE);
  return res.data;
};

/** Listar todos los comunicados con autor (para admin) */
export const listarAdmin = async () => {
  const res = await api.get(`${BASE}/admin`);
  return res.data;
};

/** Obtener un comunicado por su ID */
export const obtenerPorId = async (id) => {
  const res = await api.get(`${BASE}/admin/${id}`);
  return res.data;
};

/** Crear un nuevo comunicado */
export const crear = async (data) => {
  const res = await api.post(`${BASE}/admin`, data);
  return res.data;
};

/** Actualizar un comunicado existente */
export const actualizar = async (id, data) => {
  const res = await api.put(`${BASE}/admin/${id}`, data);
  return res.data;
};

/** Eliminar un comunicado por ID */
export const eliminar = async (id) => {
  const res = await api.delete(`${BASE}/admin/${id}`);
  return res.data;
};
