import api from "../api";

/** Iniciar sesión con documento y contraseña */
export const login = async ({ tipo_documento, documento, contrasena }) => {
  const res = await api.post("/auth/login", { tipo_documento, documento, contrasena });
  return res.data;
};

/** Registrar un nuevo aprendiz */
export const registrar = async (formData) => {
  const res = await api.post("/auth/register", formData);
  return res.data;
};

/** Enviar enlace de recuperación de contraseña al correo */
export const recuperarPassword = async (correo) => {
  const res = await api.post("/auth/recuperar", { correo });
  return res.data;
};

/** Restablecer la contraseña con un token válido */
export const restablecerPassword = async (token, nuevaContrasena) => {
  const res = await api.post("/auth/restablecer", { token, nuevaContrasena });
  return res.data;
};

// Cerrar sesión
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    // Limpiamos el storage incluso si el request falla, no podemos dejar los datos expuestos
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
  }
};