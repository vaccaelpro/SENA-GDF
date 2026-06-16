/**
 * Servicio de Metas de Ahorro (Aprendiz)
 * Maneja listado, creación, edición, suma de montos y eliminación de metas de ahorro.
 */
import api from "../api";

const BASE = "/aprendiz/metas";

/** Obtener todas las metas de un usuario */
export const listarMetas = async (idUsuario) => {
  const res = await api.get(`${BASE}/${idUsuario}`);
  return res.data;
};

/** Crear una nueva meta */
export const crearMeta = async (data) => {
  const res = await api.post(BASE, data);
  return res.data;
};

/** Editar una meta existente */
export const editarMeta = async (idAhorro, data) => {
  const res = await api.put(`${BASE}/${idAhorro}`, data);
  return res.data;
};

/** Agregar monto a una meta */
export const agregarMonto = async (idAhorro, monto) => {
  const res = await api.patch(`${BASE}/${idAhorro}/monto`, { monto });
  return res.data;
};

/** Eliminar una meta */
export const eliminarMeta = async (idAhorro) => {
  const res = await api.delete(`${BASE}/${idAhorro}`);
  return res.data;
};
