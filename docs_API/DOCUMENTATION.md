# Documentación técnica — Consumo del microservicio de Usuarios JPA

**Módulo:** Gestión de Usuarios JPA (frontend, rol Administrador)
**Proyecto:** SENA GDF — frontend React (CRA) + backend Express
**Contrato fuente:** `API_FRONTEND_GUIDE.md` y el código del microservicio
(`MainController`, `UserRequest`/`UserResponse`, `ExceptionController`).
Si esta documentación y el código del microservicio difieren, **el código gana**.

---

## 1. Resumen

El módulo **Gestión de Usuarios JPA** permite al administrador operar el CRUD
completo del microservicio REST de usuarios construido con **Java 21 +
Spring Boot + JPA**. El frontend lo consume mediante una capa de servicio
dedicada, sin modificar la integración existente con el backend Express.

| Pieza | Archivo | Responsabilidad |
|---|---|---|
| Cliente HTTP JPA | `frontend/src/services/apiJpa.js` | Instancia axios dedicada (sin JWT), normalización del `ApiError` envelope |
| Servicio | `frontend/src/services/admin/usuariosJpa.service.js` | CRUD + listado paginado + búsqueda OR |
| Vista | `frontend/src/pages/admin/gestion_usuarios_jpa.jsx` | Tabla, búsqueda, paginación de servidor, modal crear/editar, eliminación |
| Estilos específicos | `frontend/src/css/gestion_usuarios_jpa.css` | Complementos sobre los tokens de `gestion_usuarios.css` |
| Ruta | `frontend/src/App.js` → `/Tabla_gestion_usuarios_jpa` | Dentro de `ProtectedRoute allowedRole="ADMIN"` |
| Menú | `frontend/src/components/sidebar_admin.jsx` | Enlace "Gestión de Usuarios JPA" |
| Configuración | `frontend/.env` → `REACT_APP_JPA_API_URL` | URL base del microservicio |

**¿Por qué una instancia axios separada (`apiJpa.js`)?**
La instancia existente (`api.js`) apunta al backend Express, adjunta un JWT
y redirige al login ante un 401. El microservicio JPA es otro backend
(puerto 8080) y **no tiene capa de autenticación** (`permitAll`): enviarle un
JWT o reaccionar a un 401 no aplica y complicaría el diagnóstico de errores.

---

## 2. Entorno y configuración

| Entorno | Base URL del microservicio |
|---|---|
| Desarrollo local | `http://localhost:8080` |
| Producción | La define DevOps (despliegue Aiven) |

Variable de entorno del frontend:

```
REACT_APP_JPA_API_URL=http://localhost:8080
```

> CRA exige que las variables comiencen por `REACT_APP_` y requiere
> **reiniciar** `npm start` tras cambiar el `.env`.

### 2.1 CORS — leer antes de la primera llamada

La API acepta llamados del navegador **únicamente desde `http://localhost:3000`**
(un solo origen, sin comodín). Esto tiene consecuencias prácticas:

- El servidor de desarrollo del frontend **debe correr en el puerto 3000**
  (es el puerto por defecto de CRA).
- Un preflight desde cualquier otro origen **no recibe** el header
  `Access-Control-Allow-Origin` y el navegador bloquea la llamada. Es
  intencional, no un bug.
- Clientes no-navegador (curl, Postman, móviles) o llamados same-origin no se
  ven afectados.

Si el frontend corre en otro puerto, `apiJpa.js` devuelve el error de
conexión ("No se pudo conectar con el servicio JPA…").

### 2.2 Rate limiting

- **Bucket global por IP** compartido entre TODOS los endpoints.
- Valores por defecto: **100 solicitudes, con refill de 100/minuto**
  (`RATE_LIMIT_CAPACITY` / `RATE_LIMIT_REFILL_PER_MINUTE`).
- Al excederlo: `429 Too Many Requests` con header **`Retry-After`**
  (segundos hasta poder reintentar). El frontend lo muestra en el mensaje
  al usuario.
- IP del cliente: primer valor de `X-Forwarded-For` si existe; si no, la
  dirección remota directa.

---

## 3. Endpoints

Todas las rutas cuelgan de `/api/users` y responden `application/json`.

### 3.1 Crear usuario — `POST /api/users`

Cuerpo (`UserRequest`), campos obligatorios al crear:

| Campo | Obligatorio al crear |
|---|---|
| `primerNombre`, `primerApellido`, `tipoDocumento`, `documento`, `celular`, `correoElectronico` | Sí |
| `contrasena` | **Sí (solo al crear)** — mínimo 8 caracteres, viaja en texto plano sobre TLS, jamás se almacena ni se devuelve |
| `segundoNombre`, `segundoApellido`, `grupoFormacion`, `rol`, `tipoApoyo` | No |
| `fechaRegistro`, `ultimaActualizacion` | Nunca — los maneja la base de datos; se ignoran al construir |

Respuestas:

- `201 Created` → `UserResponse`. Si no se envía `rol`, un trigger aplica por
  defecto `USUARIO` y así aparece en la respuesta.
- `400 Bad Request` → campo faltante/inválido (`"Invalid or missing field:
<nombre>"`), rechazo del sanitizer o contraseña < 8 caracteres.
- `409 Conflict` → `documento` o `correoElectronico` ya existen; el mensaje
  nombra el campo en conflicto.

### 3.2 Obtener por id — `GET /api/users/{id}`

- `200 OK` → `UserResponse`
- `404 Not Found` → no existe un usuario con ese id

### 3.3 Actualización completa — `PUT /api/users/{id}`

Cuerpo: mismo shape que crear, **con `contrasena` opcional**. Omitirla (o
enviar `null`) conserva la contraseña actual; si se envía, aplican las reglas
de mínimo 8 y se re-hashea.

- `200 OK` → `UserResponse` actualizado
- `400 Bad Request` → validación / sanitizer / contraseña corta
- `404 Not Found` → el id no existe
- `409 Conflict` → el nuevo `documento`/`correoElectronico` pertenece a otro
  usuario

### 3.4 Eliminar — `DELETE /api/users/{id}`

- `204 No Content` → eliminado (cuerpo vacío)
- `404 Not Found` → el id no existe

### 3.5 Listado paginado — `GET /api/users?page=0&size=7`

| Parámetro | Default | Notas |
|---|---|---|
| `page` | `0` | 0-based; los negativos se claman a 0 |
| `size` | `7` | **Tope duro de 7.** Pedir `size=50` devuelve 7 por página con `200 OK`: se clama en silencio, nunca es error. La matemática de paginación se basa en la metadata devuelta, no en lo pedido. |

- `200 OK` → envelope paginado (§5). Una página fuera de rango devuelve
  `200` con `content` vacío — **no** 404.

### 3.6 Búsqueda AND — `GET /api/users/search/and`

`?primerNombre=Ana&documento=1032547896&page=0&size=7`

| Parámetro | Obligatorio | Notas |
|---|---|---|
| `primerNombre` | Sí | Coincidencia exacta del primer nombre |
| `documento` | Sí | `Long` numérico — si no es entero válido responde `400` |
| `page`, `size` | No | Mismas reglas que §3.5 |

- `200 OK` → envelope paginado; vacío es `200` con `content` vacío.
- `400 Bad Request` → `documento` faltante o no numérico.

### 3.7 Búsqueda OR — `GET /api/users/search/or`

`?term=Ana&page=0&size=7`

| Parámetro | Obligatorio | Notas |
|---|---|---|
| `term` | Sí | Compara contra `primerNombre` O `primerApellido`; si el término es puramente numérico **también** compara contra `documento`. Los términos no numéricos nunca intentan comparación numérica (queries parametrizados, sin inyección). |
| `page`, `size` | No | Mismas reglas que §3.5 |

- `200 OK` → envelope paginado (vacío es `200`, no 404).

---

## 4. Formas de datos

### `UserRequest` (entrada)

```json
{
  "primerNombre": "Ana",             // string, obligatorio
  "segundoNombre": "Maria",          // string, opcional
  "primerApellido": "Garcia",        // string, obligatorio
  "segundoApellido": "Lopez",        // string, opcional
  "tipoDocumento": "CC",             // enum, obligatorio — "CC" | "TI"
  "documento": 1032547896,           // number (Long), obligatorio
  "celular": "3001234567",           // string, obligatorio
  "grupoFormacion": "ADSO-2876754",  // string, opcional
  "correoElectronico": "a@b.co",     // string, obligatorio
  "contrasena": "super-secret-123",  // string, obligatorio en POST, opcional en PUT
  "rol": "ADMIN",                    // enum, opcional — "ADMIN" | "USUARIO"
  "tipoApoyo": "regular"             // enum, opcional — "regular" | "alimentacion" | "transporte"
}
```

**Regla del sanitizer**: entradas con `<script>`, atributos de eventos
(`onerror=`, …) o path traversal (`../`) se rechazan con `400`. Unicode es
seguro: `José Lía` pasa intacto.

**Convención del módulo**: los campos opcionales se envían como `null` (no
como cadenas vacías). En edición, si `contrasena` queda vacía se omite del
payload para conservar la contraseña actual.

### `UserResponse` (salida)

Mismos campos que el request **menos `contrasena`** — el campo no existe en
la respuesta, así nunca se expone ni el texto plano ni el hash BCrypt.
Además incluye:

| Campo | Significado |
|---|---|
| `id` | Id entero, asignado al crear |
| `fechaRegistro` | Fecha ISO-8601, la asigna la BD una sola vez |
| `ultimaActualizacion` | Fecha ISO-8601, la actualiza un trigger en cada update — no se envía, solo se muestra |

### Tipos en JavaScript

```ts
interface UserResponse {
  id: number;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  tipoDocumento: "CC" | "TI";
  documento: number;
  celular: string;
  grupoFormacion: string | null;
  correoElectronico: string;
  rol: "ADMIN" | "USUARIO" | null;
  tipoApoyo: "regular" | "alimentacion" | "transporte" | null;
  fechaRegistro: string;          // ISO-8601
  ultimaActualizacion: string;    // ISO-8601
}
```

---

## 5. Envelope paginado

Todos los endpoints de lista/búsqueda devuelven un `PagedModel` de Spring:

```json
{
  "content": [ { "...": "UserResponse" } ],
  "page": {
    "size": 7,
    "number": 0,
    "totalElements": 23,
    "totalPages": 4
  }
}
```

- `size` — el tamaño **efectivo** de página (tras el clamo a 7).
- `number` — página actual, 0-based.
- El frontend conduce "anterior/siguiente" desde `number` y `totalPages`,
  y hace un paso atrás automático si la página pedida llega vacía con
  `number > 0`.

---

## 6. Manejo de errores

Todo error — de cualquier endpoint — llega en el mismo envelope `ApiError`:

```json
{
  "timestamp": "2026-09-24T21:12:05",
  "status": 404,
  "error": "Not Found",
  "message": "User with id 999 not found",
  "path": "/api/users/999"
}
```

| Status | Cuándo | Comportamiento del `message` |
|---|---|---|
| `400` | Falta un request param | Nombre crudo del parámetro en el mensaje |
| `400` | Falla la validación del body | `"Invalid or missing field: <campo>"` (primer campo fallido) |
| `400` | Rechazo del sanitizer / contraseña < 8 | Razón específica |
| `404` | Id desconocido o ruta desconocida | `"Resource not found"` para rutas sin ruteo |
| `409` | `documento`/`correoElectronico` duplicado | Nombra el campo en conflicto; `"Uniqueness conflict"` genérico en una carrera de BD — nunca SQL crudo |
| `429` | Rate limit excedido | `"Too many requests"` + header **`Retry-After`** |
| `500` | Cualquier imprevisto | `"Error Interno del Servidor"` fija — stack traces y SQL nunca salen del servidor |

**Patrón del cliente (`apiJpa.js`):** el interceptor traduce el envelope a un
`ApiJpaError` con `status`, `message` y `retryAfter` (solo en 429). La vista
los muestra con `sweetalert2` y, si es un 409, marca en el formulario el
campo que el mensaje señala como conflictivo.

---

## 7. Decisiones de consumo del módulo

| # | Decisión | Motivo |
|---|---|---|
| D1 | Cliente axios dedicado (`apiJpa.js`) sin JWT ni redirección por 401 | El microservicio es otro backend y es `permitAll` |
| D2 | Campos camelCase directos (`primerNombre`, …) | Coinciden con el contrato; sin capa de traducción |
| D3 | Paginación 100% del lado del servidor, tamaño fijo 7 | La API clama el `size` a 7 de forma silenciosa |
| D4 | Búsqueda con `search/or` + debounce de 350 ms | Un solo término cubre nombre, apellido y documento |
| D5 | Un solo modal para crear y editar | `contrasena` obligatoria al crear, opcional al editar (vacía = conservar) |
| D6 | Enums de la API: `CC`/`TI`, `USUARIO`/`ADMIN`, `regular`/`alimentacion`/`transporte` | La UI los muestra con etiquetas en español |
| D7 | Errores leídos del envelope `ApiError`; `429` con `Retry-After` | El `message` del backend siempre es lo que se muestra |

---

## 8. Cosas que esta API NUNCA hace

- Nunca devuelve `contrasena` ni hashes, en ninguna respuesta.
- Las rutas desconocidas (incluidas las legacy `/demo/**` y `/login`)
  responden `404` envuelto en el envelope — nunca páginas HTML de error.
- Pedir más de 7 registros por página nunca falla: se clama en silencio.
- El log de MongoDB es observabilidad interna: no tiene contrato de cara al
  cliente y no puede romper tus requests (degrada en silencio si Mongo cae).
