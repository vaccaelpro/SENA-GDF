/**
 * Cliente HTTP dedicado al microservicio de Usuarios JPA (Spring Boot).
 *
 * Se separa de `api.js` a propósito:
 * - Apunta a OTRO backend (puerto 8080), configurable con REACT_APP_JPA_API_URL.
 * - La API JPA no tiene capa de autenticación (permitAll): no se adjunta JWT
 *   y no aplica la redirección global por 401 del interceptor de api.js.
 */
import axios from "axios";

/**
 * Error normalizado del microservicio JPA.
 * Expone `status` (HTTP), `message` (del ApiError envelope) y, si el servidor
 * respondió 429, `retryAfter` en segundos (header Retry-After).
 */
export class ApiJpaError extends Error {
  constructor(message, { status = 0, path = "", retryAfter = null } = {}) {
    super(message);
    this.name = "ApiJpaError";
    this.status = status;
    this.path = path;
    this.retryAfter = retryAfter;
  }
}

const apiJpa = axios.create({
  baseURL: process.env.REACT_APP_JPA_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Interceptor de respuesta: traduce el ApiError envelope del microservicio
// a un ApiJpaError con los datos útiles para la UI.
apiJpa.interceptors.response.use(
  (response) => response,
  (error) => {
    // Timeout: el servidor pudo haber completado la operación (p. ej. un POST
    // con BCrypt en una JVM fría) pero la respuesta tardó demasiado.
    if (error.code === "ECONNABORTED") {
      return Promise.reject(
        new ApiJpaError(
          "El servicio JPA tardó demasiado en responder.",
          { status: 0 }
        )
      );
    }

    // Sin respuesta: servicio caído, CORS bloqueado o corte de red.
    if (!error.response) {
      return Promise.reject(
        new ApiJpaError(
          "No se pudo conectar con el servicio JPA. Verifica que el microservicio esté activo en el puerto 8080 y que el frontend corra en localhost:3000 (CORS).",
          { status: 0 }
        )
      );
    }

    const { status, data, headers } = error.response;
    const message =
      (data && typeof data.message === "string" && data.message) ||
      `Error ${status} del servicio JPA`;

    if (status === 429) {
      const raw = headers?.["retry-after"] ?? headers?.["Retry-After"];
      const parsed = Number(raw);
      return Promise.reject(
        new ApiJpaError(
          `Demasiadas solicitudes al servicio JPA. Intenta de nuevo en ${Number.isFinite(parsed) ? parsed : 60} segundos.`,
          { status, path: data?.path || "", retryAfter: Number.isFinite(parsed) ? parsed : 60 }
        )
      );
    }

    return Promise.reject(new ApiJpaError(message, { status, path: data?.path || "" }));
  }
);

export default apiJpa;
