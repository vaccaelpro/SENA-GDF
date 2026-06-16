/**
 * Servicio de Grupo del Aprendiz
 * Obtiene información del grupo al que pertenece el aprendiz,
 * sus miembros y el historial de mensajes del chat grupal.
 */
import api from "../api";

const BASE = "/aprendiz/mi-grupo";

/** Obtener el grupo del aprendiz según su ID de usuario */
export const obtenerMiGrupo = async (idUsuario) => {
  const res = await api.get(`${BASE}/${idUsuario}`);
  return res.data;
};

/** Obtener los miembros del grupo del aprendiz */
export const obtenerMiembrosGrupo = async (idUsuario) => {
  const res = await api.get(`${BASE}/${idUsuario}/miembros`);
  return res.data;
};

/** Obtener los mensajes del chat del grupo del aprendiz */
export const obtenerMensajesGrupo = async (idUsuario) => {
  const res = await api.get(`${BASE}/${idUsuario}/mensajes`);
  return res.data;
};
