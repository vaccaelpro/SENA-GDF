import api from "../api";

export const crearEncuesta = async (data) => {
  const res = await api.post("/admin/encuestas", data);
  return res.data;
};

export const listarEncuestas = async () => {
  const res = await api.get("/admin/encuestas");
  return res.data;
};

export const obtenerEncuesta = async (id) => {
  const res = await api.get(`/admin/encuestas/${id}`);
  return res.data;
};

export const eliminarEncuesta = async (id) => {
  const res = await api.delete(`/admin/encuestas/${id}`);
  return res.data;
};

export const enviarRespuestasEncuesta = async (idEncuesta, data) => {
  const res = await api.post(`/admin/encuestas/${idEncuesta}/respuestas`, data);
  return res.data;
};

export const obtenerAnalisisEncuesta = async (idEncuesta) => {
  const res = await api.get(`/admin/encuestas/${idEncuesta}/analisis`);
  return res.data;
};

export const verificarRespuestaUsuario = async (idEncuesta, idUsuario) => {
  const res = await api.get(`/admin/encuestas/${idEncuesta}/verificar/${idUsuario}`);
  return res.data;
};
