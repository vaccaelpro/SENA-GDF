/**
 * Cliente HTTP centralizado para SENA GDF
 * Base URL configurable y headers por defecto.
 */
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Interceptor de petición: puede agregar token en el futuro
api.interceptors.request.use(
  (config) => {
    // Si en el futuro se implementa JWT, aquí se adjunta:
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
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
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
