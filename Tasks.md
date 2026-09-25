# Tasks — New module "Gestión de Usuarios JPA" (admin)

> Status: **DONE — implemented and validated by the product owner (additive wiring + Spanish docs authorized in conversation).**
> Source of truth for the API contract: `API_FRONTEND_GUIDE.md` (v of 2026-09-24).
> Reference view for design/UX mirroring: `frontend/src/pages/admin/gestion_usuarios.jsx`.

## 0. Context discovered (read-only survey, done)

- Stack: CRA (`react-scripts 5.0.1`), React 19, `react-router-dom` v7, `axios`, Bootstrap 5, `sweetalert2` (already installed), `react-icons`.
- Conventions of the existing project:
  - One component per page in `frontend/src/pages/admin/*.jsx` + one CSS per page in `frontend/src/css/*.css`.
  - Service layer: `frontend/src/services/<area>/<name>.service.js` with a `const BASE = "/..."` pattern on top of `frontend/src/services/api.js` (axios instance, `REACT_APP_API_URL`, JWT interceptor, 401 redirect).
  - UI: `.custom-table` with green gradient header (`#28a745 → #20c997`), `.form-control-premium` / `.form-group-premium` / `.btn-save-premium` modal forms, `.page-item-btn` pagination, spinners `spinner-border text-success`, `Swal.fire` for confirmation/success/error, inline per-field errors with `frontend/src/utils/validators.js`.
  - UI copy is **Spanish** (kept in Spanish in the new view).
- CORS constraint from the API: it only accepts the origin `http://localhost:3000`. **CRA's dev server runs on port 3000 by default — no change needed.**
- The JPA API (port `8080`) is a **different backend** than the current Express API (port `3001`). It has **no authentication layer** (`permitAll`), so it must NOT reuse the `api.js` instance (which injects a JWT and redirects on 401).

## 1. Decisions proposed (validate or modify)

| # | Decision | Proposal |
|---|----------|----------|
| D1 | HTTP client for the JPA API | New axios instance `apiJpa.js` (no JWT, no 401 redirect, `REACT_APP_JPA_API_URL`). Does not touch `api.js`. |
| D2 | Field naming | The view works directly with the API's **camelCase** fields (`primerNombre`, `tipoDocumento`, …) — no snake_case/camelCase translation layer. |
| D3 | Pagination | Server-side, driven by the returned `page` metadata (`number` / `totalPages`). Fixed size of **7** (the API clamps to 7 anyway). |
| D4 | Search | Uses `GET /api/users/search/or?term=…` (debounced) when the box has text; otherwise the paged list. An empty result renders an empty state (the API returns 200, never 404). |
| D5 | Create / Edit | One modal for both cases. `contrasena` is **required only on create** (min 8 chars) and **optional on edit** (empty = keep the current password). |
| D6 | Enums | `tipoDocumento`: `CC` / `TI`. `rol`: `USUARIO` / `ADMIN` (displayed as "Aprendiz" / "Administrador"). `tipoApoyo`: `regular` / `alimentacion` / `transporte` + N/A (null). |
| D7 | Errors | All errors are read from the `ApiError` envelope (`message`). `409` conflicts name the conflicting field → shown in Swal. `429` → message with the seconds from `Retry-After`. |
| D8 | Route | `/Tabla_gestion_usuarios_jpa`, inside the existing `ProtectedRoute allowedRole="ADMIN"` block, and a link in `sidebar_admin.jsx`. **Modifying `App.js` and `sidebar_admin.jsx` requires your authorization** (your rule "do not modify the original code"). These are additive changes only (import + 1 line each). |
| D9 | Docs language | `docs_API/DOCUMENTATION.md` and `docs_API/STEP_BY_STEP.md` are proposed in **Spanish** (project delivery language). Confirm or ask for English. |

## 2. Step-by-step task plan

### Task 1 — JPA axios client — `frontend/src/services/apiJpa.js` (new file)
- [ ] 1.1 Create an axios instance: `baseURL: process.env.REACT_APP_JPA_API_URL`, `Content-Type: application/json`, `timeout: 15000`.
- [ ] 1.2 Response interceptor: on error, normalize and rethrow `{ status, message }` extracted from the `ApiError` envelope; on `429` attach `retryAfter` (seconds from the `Retry-After` header, default 60).
- [ ] 1.3 Fallback message when the server is unreachable: `"No se pudo conectar con el servicio JPA"`.

### Task 2 — JPA service layer — `frontend/src/services/admin/usuariosJpa.service.js` (new file)
- [ ] 2.1 `listarUsuariosJpa(page = 0, size = 7)` → `GET /api/users?page&size` (returns the full paged envelope `{ content, page }`).
- [ ] 2.2 `crearUsuarioJpa(payload)` → `POST /api/users`.
- [ ] 2.3 `actualizarUsuarioJpa(id, payload)` → `PUT /api/users/{id}`.
- [ ] 2.4 `eliminarUsuarioJpa(id)` → `DELETE /api/users/{id}` (handles `204` with no body).
- [ ] 2.5 `buscarUsuariosJpa(term, page = 0)` → `GET /api/users/search/or?term&page`.

### Task 3 — View "Gestión de Usuarios JPA" — `frontend/src/pages/admin/gestion_usuarios_jpa.jsx` (new file)
- [ ] 3.1 Table mirroring `gestion_usuarios.jsx` (`custom-table`): columns Nombres, Apellidos, Tipo Doc., Documento, Celular, Grupo Formación, Correo, Rol (badge), Tipo Apoyo (badge), Última Actualización (formatted date), Acciones (Editar / Eliminar).
- [ ] 3.2 Search box ("Buscar por nombre, apellido o documento…") with a ~350 ms debounce; switching between list/search resets to page 0.
- [ ] 3.3 **Server-side pagination** (`pagination-container`, `page-item-btn`): Previous/Next + numbered pages, driven strictly by `page.totalPages` and `page.number`. If a page comes back empty and `number > 0` (out-of-range), step back one page instead of showing a blank table.
- [ ] 3.4 UI states: **loading** (centered `spinner-border text-success`), **empty** ("No se encontraron usuarios…" row), **error** (Swal error + inline row with a "Reintentar" button that re-fetches).
- [ ] 3.5 Create/Edit modal (mirroring the existing modal: `form-group-premium`, `form-control-premium`, `btn-save-premium`):
  - Fields: primerNombre*, segundoNombre, primerApellido*, segundoApellido, tipoDocumento* (select CC/TI), documento* (numeric), celular*, grupoFormacion, correoElectronico*, rol (select), tipoApoyo (select + N/A).
  - `contrasena` field: required only in create mode (min 8); in edit mode it shows the placeholder "Leave empty to keep the current password" and the field is omitted from the payload when empty.
  - Inline validation per field with `utils/validators.js` (letters, 6–11 digit document, 10-digit phone, email, password ≥ 8) + validation summary via Swal (`"Validación"…`) following the existing pattern.
  - Payload sanitation: fields that the API expects nullable (`segundoNombre`, `segundoApellido`, `grupoFormacion`, `tipoApoyo`) are sent as `null` — not empty strings.
- [ ] 3.6 Delete: `Swal.fire` warning confirmation ("¿Estás seguro?…", green confirm `#28a745` / red cancel `#d33`) then `DELETE`; success toast and list refresh.
- [ ] 3.7 Surface API errors honestly: `400` (show `message` from the envelope), `409` (highlight conflicting document/email), `404`, `429` (show the wait seconds), `5xx` (generic).
- [ ] 3.8 After every mutation: refresh the current page and keep the admin's position.

### Task 4 — Styles — `frontend/src/css/gestion_usuarios_jpa.css` (new file)
- [ ] 4.1 Reuse tokens: `.custom-table`, `.page-item-btn`, `.pagination-container`, `.modal`, premium form classes, `.btn-edit` / `.btn-delete` and the green gradient.
- [ ] 4.2 Only JPA-specific additions: date column (smaller / `text-muted`), badges for `tipoDocumento`, and the error/empty states. No redesign of the existing ones.

### Task 5 — Wiring (⚠️ requires your authorization — it touches original files)
- [ ] 5.1 `frontend/.env`: add `REACT_APP_JPA_API_URL=http://localhost:8080` (new variable; nothing existing is modified).
- [ ] 5.2 `frontend/src/App.js`: additive change — import + `<Route path="/Tabla_gestion_usuarios_jpa" element={<GestionUsuariosJpa />} />` inside the ADMIN block.
- [ ] 5.3 `frontend/src/components/sidebar_admin.jsx`: additive change — `<Link to="/Tabla_gestion_usuarios_jpa">Gestión de Usuarios JPA</Link>` in the same group as "Gestión de Usuarios".
- If you prefer **zero modifications to original files**, the view will be accessible only by typing the URL directly and the sidebar step is dropped (it will be documented like this in STEP_BY_STEP.md). Tell me your choice when validating.

### Task 6 — Documentation — `docs_API/` (new files)
- [ ] 6.1 `docs_API/DOCUMENTATION.md`: technical doc of the microservice (base URL, CORS, rate limiting, all 7 endpoints with request/response examples, `UserRequest`/`UserResponse` shapes, paged envelope, `ApiError` envelope and status table) + how the module consumes it (files, decisions D1–D8).
- [ ] 6.2 `docs_API/STEP_BY_STEP.md`: manual build guide (run the microservice on 8080, `REACT_APP_JPA_API_URL`, dev server on 3000 + why the port matters for CORS, and the complete CRUD flow through the UI).

### Task 7 — Manual verification (test scenarios)
- [ ] 7.1 Happy path: create → list → search → edit → delete, with its Swal messages.
- [ ] 7.2 Conflict: duplicate `documento`/`correoElectronico` → `409` with the field named.
- [ ] 7.3 Validation: invalid fields → inline errors; password < 8 → `400`.
- [ ] 7.4 Empty state and out-of-range pagination.
- [ ] 7.5 Microservice down with the UI open → connection error message + "Reintentar".
- [ ] 7.6 CORS sanity check: app served on `localhost:3000`.

### Task 8 — Automated tests (optional, recommended)
- [ ] 8.1 Vitest tests for `usuariosJpa.service.js` (mocked axios): envelope parsing, error normalization, `Retry-After` on `429`.
- [ ] 8.2 Basic smoke test of the view: loading → populated table, and the empty state.

## 3. Out of scope (explicitly NOT done)

- No changes to the existing `gestion_usuarios.jsx` module (it talks to the Express API and keeps working as-is).
- No authentication against the JPA API (it is `permitAll`). No migration of this app's login.
- No deployment changes (Docker, CI) — local consumption only, just like the current setup.

## 4. Quick validation checklist for you

1. ✅ Decisions D1–D9? (especially **D8: authorization to additively touch `App.js` and `sidebar_admin.jsx`** and **D9: docs language**)
2. ✅ Is the proposed route name OK for you (`/Tabla_gestion_usuarios_jpa`)?
3. ✅ Create users from this screen too, or should it be read/update/delete only?
4. ✅ Anything in scope you want to add or remove?
