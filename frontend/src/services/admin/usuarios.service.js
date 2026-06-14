/**
 * Servicio de Usuarios (Admin)
 * Maneja listado, actualización y eliminación de usuarios del sistema.
 */
import api from "../api";

const BASE = "/admin/usuarios";

/** Obtener todos los aprendices (rol USUARIO) */
export const listarUsuarios = async () => {
  const res = await api.get(BASE);
  return res.data;
};

/** Actualizar datos de un usuario por su ID */
export const actualizarUsuario = async (id, data) => {
  const res = await api.put(`${BASE}/${id}`, data);
  return res.data;
};

/** Eliminar un usuario por su ID */
export const eliminarUsuario = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};
