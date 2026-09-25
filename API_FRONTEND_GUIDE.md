# Frontend API Consumption Guide

Everything the frontend team needs to talk to the User Management API: endpoints, request payloads, response shapes, and error handling.

> Source of truth: `MainController`, `UserRequest`/`UserResponse`, and `ExceptionController` in `src/main/java/com/sena/mysqlwithjpa/`. If this guide and the code ever disagree, the code wins — open an issue.

---

## 1. Quick start (30 seconds)

Create a user:

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "primerNombre": "Ana",
    "primerApellido": "Garcia",
    "tipoDocumento": "CC",
    "documento": 1032547896,
    "celular": "3001234567",
    "correoElectronico": "ana.garcia@example.com",
    "contrasena": "super-secret-123"
  }'
```

Response `201 Created`:

```json
{
  "id": 42,
  "primerNombre": "Ana",
  "segundoNombre": null,
  "primerApellido": "Garcia",
  "segundoApellido": null,
  "tipoDocumento": "CC",
  "documento": 1032547896,
  "celular": "3001234567",
  "grupoFormacion": null,
  "correoElectronico": "ana.garcia@example.com",
  "rol": "USUARIO",
  "tipoApoyo": null,
  "fechaRegistro": "2026-09-24T21:10:33",
  "ultimaActualizacion": "2026-09-24T21:10:33"
}
```

---

## 2. Base URL and environment

| Environment | Base URL |
|-------------|----------|
| Local dev   | `http://localhost:8080` |
| Production  | Provided by DevOps (Aiven-deployed) |

There is **no authentication layer** yet: all endpoints are open (the security chain is `permitAll`). Do not assume this stays true — the API contract is designed so a future auth filter does not change route shapes.

### CORS — read this before your first call

The API accepts browser calls **only from `http://localhost:3000`** (single origin, no wildcard). That means:

- Your local dev server **must run on port 3000** (or ask the backend team to add your origin to `CorsConfig`).
- A preflight from any other origin receives **no** `Access-Control-Allow-Origin` header — the browser will block the call. This is intentional, not a bug.
- Same-origin / non-browser callers (curl, Postman, mobile) are unaffected.

### Rate limiting

- **Global per-IP bucket**: the limit is shared across ALL endpoints, not per-endpoint.
- Defaults: **100 requests, refilled at 100/minute** (configurable via `RATE_LIMIT_CAPACITY` / `RATE_LIMIT_REFILL_PER_MINUTE`).
- When exceeded you get `429 Too Many Requests` with a **`Retry-After`** header (seconds until you can retry). Honor it.
- Client IP resolution: first value of the `X-Forwarded-For` header if present, otherwise the direct remote address. If your dev proxy sets `X-Forwarded-For`, each distinct value gets its own bucket.

---

## 3. Endpoint reference

### 3.1 Create user

`POST /api/users`

**Body** (`application/json`) — see field table in §4:

| Field | Required on create |
|-------|--------------------|
| `primerNombre`, `primerApellido`, `tipoDocumento`, `documento`, `celular`, `correoElectronico` | Yes |
| `contrasena` | **Yes (create only)** — min 8 characters, sent as plaintext over TLS, never stored or returned |
| `segundoNombre`, `segundoApellido`, `grupoFormacion`, `rol`, `tipoApoyo` | No |
| `fechaRegistro`, `ultimaActualizacion` | Never — DB-owned; ignored by construction |

**Responses**

- `201 Created` → `UserResponse` (see §4). Note: if `rol` is omitted, the database default `USUARIO` is applied by a trigger and appears in the response.
- `400 Bad Request` → missing/invalid field (`"Invalid or missing field: <name>"`), sanitizer rejection (XSS/path-traversal payloads), or password < 8 chars.
- `409 Conflict` → `documento` or `correoElectronico` already exists; the message names the conflicting field.

### 3.2 Get user by id

`GET /api/users/{id}`

- `200 OK` → `UserResponse`
- `404 Not Found` → no user with that id

### 3.3 Update user (full update)

`PUT /api/users/{id}`

**Body**: same shape as create, **except `contrasena` is optional**. Omit it (or send `null`) to keep the current password untouched. If present, min-8 rules apply and the new value is re-hashed.

- `200 OK` → updated `UserResponse`
- `400 Bad Request` → validation / sanitizer / short password
- `404 Not Found` → id does not exist
- `409 Conflict` → the new `documento`/`correoElectronico` belongs to another user

### 3.4 Delete user

`DELETE /api/users/{id}`

- `204 No Content` → deleted (empty body)
- `404 Not Found` → id does not exist

### 3.5 List users (paged)

`GET /api/users?page=0&size=7`

| Param | Default | Notes |
|-------|---------|-------|
| `page` | `0` | 0-based; negative values are clamped to 0 |
| `size` | `7` | **Hard max is 7.** Asking for `size=50` returns 7 per page with `200 OK` — it is silently clamped, never an error. Base your pagination math on the returned metadata, not on what you asked for. |

- `200 OK` → paged envelope (§5). An out-of-range page (e.g. page 99) returns `200` with empty `content` — **not** 404.

### 3.6 Search — AND (both criteria must match)

`GET /api/users/search/and?primerNombre=Ana&documento=1032547896&page=0&size=7`

| Param | Required | Notes |
|-------|----------|-------|
| `primerNombre` | Yes | Exact match on first name |
| `documento` | Yes | Numeric `Long` — must be a valid integer or you get `400` |
| `page`, `size` | No | Same rules as §3.5 |

- `200 OK` → paged envelope; empty result is `200` with empty `content` (not 404).
- `400 Bad Request` → `documento` missing or non-numeric.

### 3.7 Search — OR (any criterion may match)

`GET /api/users/search/or?term=Ana&page=0&size=7`

| Param | Required | Notes |
|-------|----------|-------|
| `term` | Yes | Matches against `primerNombre` OR `primerApellido`; if the term is purely numeric it **also** matches against `documento`. Non-numeric terms never attempt a numeric comparison — `"Ana' OR '1'='1"` is treated as a literal string (parameterized queries, no injection). |
| `page`, `size` | No | Same rules as §3.5 |

- `200 OK` → paged envelope (empty is `200`, not 404).

---

## 4. Data shapes

### `UserRequest` (inbound)

```json
{
  "primerNombre": "Ana",            // string, required
  "segundoNombre": "Maria",         // string, optional
  "primerApellido": "Garcia",       // string, required
  "segundoApellido": "Lopez",       // string, optional
  "tipoDocumento": "CC",            // enum, required — "CC" | "TI"
  "documento": 1032547896,          // number (Long), required
  "celular": "3001234567",          // string, required
  "grupoFormacion": "ADSO-2876754", // string, optional
  "correoElectronico": "a@b.co",    // string, required
  "contrasena": "super-secret-123", // string, required on POST, optional on PUT
  "rol": "ADMIN",                   // enum, optional — "ADMIN" | "USUARIO"
  "tipoApoyo": "regular"            // enum, optional — "regular" | "alimentacion" | "transporte"
}
```

**Sanitizer rule**: inputs containing `<script>`, event-handler attributes (`onerror=`…), or path traversal (`../`) are rejected with `400`. Unicode is safe: `José Lía` passes untouched.

### `UserResponse` (outbound)

Same fields as the request **minus `contrasena`** — the field does not exist in the response shape, so neither plaintext nor the stored BCrypt hash can ever leak. It adds:

| Field | Meaning |
|-------|---------|
| `id` | Integer id, assigned on creation |
| `fechaRegistro` | ISO-8601 datetime, DB-owned, set once on insert |
| `ultimaActualizacion` | ISO-8601 datetime, DB-owned, updated by trigger on every row update — do not send it, just display it |

### JavaScript types

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

### `fetch` examples

```ts
// Create
const created = await fetch("http://localhost:8080/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    primerNombre: "Ana",
    primerApellido: "Garcia",
    tipoDocumento: "CC",
    documento: 1032547896,
    celular: "3001234567",
    correoElectronico: "ana.garcia@example.com",
    contrasena: "super-secret-123",
  }),
}).then((r) => (r.status === 201 ? r.json() : r.json().then(Promise.reject)));

// Paged list
const page = await fetch("http://localhost:8080/api/users?page=0&size=7")
  .then((r) => r.json());
// page.content → UserResponse[], page.page → metadata
```

---

## 5. Paged envelope

All list/search endpoints return a Spring `PagedModel`:

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

- `size` — the **effective** page size (after clamping to 7).
- `number` — current 0-based page.
- Drive "next/previous" from `number` and `totalPages`; drive any grid size from `content.length`, not from your requested `size`.

---

## 6. Error handling

Every error — from every endpoint — comes back in the same `ApiError` envelope:

```json
{
  "timestamp": "2026-09-24T21:12:05",
  "status": 404,
  "error": "Not Found",
  "message": "User with id 999 not found",
  "path": "/api/users/999"
}
```

| Status | When | `message` behavior |
|--------|------|--------------------|
| `400` | Missing request param | Raw parameter name in message |
| `400` | Body validation failed | `"Invalid or missing field: <fieldName>"` (first failing field) |
| `400` | Sanitizer rejection / password < 8 | Specific reason |
| `404` | Unknown id, or unknown route | Generic `"Resource not found"` for unrouted paths |
| `409` | Duplicate `documento`/`correoElectronico` | Names the conflicting field (service check); a generic `"Uniqueness conflict"` on a lost DB race — never raw SQL |
| `429` | Rate limit exceeded | `"Too many requests"` + **`Retry-After` header** |
| `500` | Anything unexpected | Fixed `"Error Interno del Servidor"` — stack traces and SQL never leave the server |

Recommended client pattern:

```ts
async function callApi(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const body = res.status === 204 ? null : await res.json();
  if (!res.ok) {
    const err = body as ApiError;
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("Retry-After") ?? 60);
      // schedule retry / show "too many attempts" UI
    }
    throw new Error(`${err.status}: ${err.message}`);
  }
  return body;
}
```

---

## 7. Things that will NOT happen

- The API never returns `contrasena` or any password hash, in any response, ever.
- Unknown paths (including the legacy `/demo/**` and `/login` routes) return `404` wrapped in the envelope — never HTML error pages.
- Asking for more than 7 records per page never errors; it silently clamps.
- MongoDB logging is internal observability — it has no client-facing contract and cannot break your requests (it degrades silently if Mongo is down).
