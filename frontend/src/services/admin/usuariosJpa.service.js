/**
 * Servicio de Usuarios JPA (Admin)
 * Consume el microservicio Spring Boot/JPA de gestión de usuarios.
 *
 * Contrato (ver API_FRONTEND_GUIDE.md y docs_API/DOCUMENTATION.md):
 * - Listado y búsqueda devuelven el envelope paginado { content, page },
 *   con page.size con tope fijo de 7.
 * - Errores llegan normalizados como ApiJpaError desde apiJpa.js.
 */
import apiJpa from "../apiJpa";

const BASE = "/api/users";

// La API limita el tamaño de página a 7 de forma silenciosa.
const PAGE_SIZE = 7;

/** Listado paginado de usuarios. Devuelve el envelope completo { content, page }. */
export const listarUsuariosJpa = async (page = 0) => {
  const res = await apiJpa.get(BASE, { params: { page, size: PAGE_SIZE } });
  return res.data;
};

/**
 * Búsqueda OR: el término se compara contra primerNombre, primerApellido
 * y, si es numérico, también contra documento. Devuelve el envelope paginado.
 */
export const buscarUsuariosJpa = async (term, page = 0) => {
  const res = await apiJpa.get(`${BASE}/search/or`, {
    params: { term, page, size: PAGE_SIZE },
  });
  return res.data;
};

/**
 * AND search: BOTH criteria must match — exact primerNombre and documento.
 * `documento` must be a valid integer or the API answers 400; callers should
 * validate client-side before invoking. Returns the paged envelope.
 */
export const buscarUsuariosJpaAnd = async ({ primerNombre, documento }, page = 0) => {
  const res = await apiJpa.get(`${BASE}/search/and`, {
    params: { primerNombre, documento, page, size: PAGE_SIZE },
  });
  return res.data;
};

/** Crear un usuario. `contrasena` es obligatoria (mínimo 8 caracteres). */
export const crearUsuarioJpa = async (payload) => {
  const res = await apiJpa.post(BASE, payload);
  return res.data;
};

/**
 * Actualizar un usuario por id. Si `contrasena` no se incluye (o es null),
 * el microservicio conserva la contraseña actual.
 */
export const actualizarUsuarioJpa = async (id, payload) => {
  const res = await apiJpa.put(`${BASE}/${id}`, payload);
  return res.data;
};

/** Eliminar un usuario por id. Responde 204 sin cuerpo. */
export const eliminarUsuarioJpa = async (id) => {
  const res = await apiJpa.delete(`${BASE}/${id}`);
  return res.data;
};
