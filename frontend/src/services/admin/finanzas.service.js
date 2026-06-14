/**
 * Servicio de Finanzas Generales (Admin)
 * Obtiene el resumen de ingresos y gastos de todos los aprendices.
 */
import api from "../api";

/** Obtener el resumen financiero agregado de todos los usuarios */
export const obtenerFinanzasGenerales = async () => {
  const res = await api.get("/admin/finanzas");
  return res.data;
};
