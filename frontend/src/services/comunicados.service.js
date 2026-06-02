import axios from "axios";

const API = "http://localhost:3001/api/admin/comunicados";

export const listarPublicos = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const listarAdmin = async () => {
  const res = await axios.get(`${API}/admin`);
  return res.data;
};

export const obtenerPorId = async (id) => {
  const res = await axios.get(`${API}/admin/${id}`);
  return res.data;
};

export const crear = async (data) => {
  const res = await axios.post(`${API}/admin`, data);
  return res.data;
};

export const actualizar = async (id, data) => {
  const res = await axios.put(`${API}/admin/${id}`, data);
  return res.data;
};

export const eliminar = async (id) => {
  const res = await axios.delete(`${API}/admin/${id}`);
  return res.data;
};
