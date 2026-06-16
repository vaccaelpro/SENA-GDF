/**
 * Servicio de Presupuesto (Aprendiz)
 * Permite gestionar ingresos y gastos de forma independiente.
 */
import api from "../api";

const BASE = "/aprendiz";

// ============= INGRESOS =============

export const listarIngresos = async (idUsuario) => {
  const res = await api.get(`${BASE}/ingresos/${idUsuario}`);
  return res.data;
};

export const crearIngreso = async (data) => {
  const res = await api.post(`${BASE}/ingresos`, data);
  return res.data;
};

export const eliminarIngreso = async (idIngreso) => {
  const res = await api.delete(`${BASE}/ingresos/${idIngreso}`);
  return res.data;
};

// ============= GASTOS =============

export const listarGastos = async (idUsuario) => {
  const res = await api.get(`${BASE}/gastos/${idUsuario}`);
  return res.data;
};

export const crearGasto = async (data) => {
  const res = await api.post(`${BASE}/gastos`, data);
  return res.data;
};

export const eliminarGasto = async (idGasto) => {
  const res = await api.delete(`${BASE}/gastos/${idGasto}`);
  return res.data;
};
