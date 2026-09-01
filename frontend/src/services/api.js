/**
 * Cliente HTTP centralizado para SENA GDF
 * Base URL configurable y headers por defecto.
 */
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Interceptor de petición: agregamos el token de JWT
// como de antes ya estaba la implementación entonces solo es agregarla
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const esRutaDeAuth = url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/recuperar") || url.includes("/auth/restablecer");

    if (error.response?.status === 401 && !esRutaDeAuth) {
      //Limpiamos el token de JWT con los datos del usuario
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("usuario");
      sessionStorage.removeItem("rol");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
