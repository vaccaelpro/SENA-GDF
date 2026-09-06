/**
 * Servicio IA Finance (Aprendiz)
 * Conecta el frontend con los endpoints del asistente IA Finance del backend.
 * La API Key de OpenRouter NUNCA se maneja aquí — solo en el backend (.env).
 */
import api from "../api";

const BASE = "/aprendiz/ia-finance";

/**
 * Envía un mensaje al asistente IA Finance y recibe su respuesta.
 * @param {number} usuarioId - ID del usuario autenticado
 * @param {string} mensaje - Pregunta o mensaje del usuario
 * @returns {Promise<{respuesta: string, modeloUsado: string, alertaFinanciera: object}>}
 */
export const enviarMensajeIA = async (usuarioId, mensaje) => {
  const res = await api.post(`${BASE}/chat`, { usuarioId, mensaje });
  return res.data;
};

/**
 * Obtiene el historial de interacciones del usuario con el asistente IA.
 * @param {number} idUsuario - ID del usuario autenticado
 * @returns {Promise<Array>} Lista de interacciones ordenadas cronológicamente
 */
export const obtenerHistorialIA = async (idUsuario) => {
  const res = await api.get(`${BASE}/historial/${idUsuario}`);
  return res.data;
};

/**
 * Evalúa el estado de alerta financiera del usuario.
 * Si el balance < 20% de los ingresos, retorna alertaActiva: true con el mensaje.
 * @param {number} idUsuario - ID del usuario autenticado
 * @returns {Promise<{alertaActiva: boolean, mensaje: string|null, porcentajeBalance: number}>}
 */
export const evaluarAlertaFinanciera = async (idUsuario) => {
  const res = await api.get(`${BASE}/alerta/${idUsuario}`);
  return res.data;
};
