# Guía paso a paso — Levantar y probar "Gestión de Usuarios JPA"

Guía mínima para correr el módulo local y probar el CRUD contra el
microservicio. Se asume Windows con Node y Java 21 instalados.

---

## Paso 1 — Levantar el microservicio JPA (puerto 8080)

Desde la raíz del proyecto del microservicio (no este repo):

```bash
# con Maven
./mvnw spring-boot:run
```

Verificación rápida (en otra terminal):

```bash
curl http://localhost:8080/api/users?page=0&size=7
```

Debe responder `200 OK` con un envelope `{ "content": [...], "page": {...} }`
(si la base está vacía, `content` llega como `[]` — eso es correcto).

## Paso 2 — Configurar el frontend

1. En `frontend/.env` verifica que exista (el módulo la necesita):

   ```
   REACT_APP_JPA_API_URL=http://localhost:8080
   ```

2. Instala dependencias si hace falta:

   ```bash
   cd frontend
   npm install
   ```

3. Arranca CRA:

   ```bash
   npm start
   ```

   > **Debe levantar en `http://localhost:3000`.** Es el único origen que la
   API acepta por CORS. Si CRA te pregunta "port 3000 is in use, use another?",
   responde **no** y libera el 3000 — si el frontend corre en otro puerto,
   el navegador bloqueará todas las llamadas al microservicio.

   Si cambiaste el `.env` con el servidor corriendo, reinicia `npm start`
   (CRA no recarga variables de entorno en caliente).

## Paso 3 — Entrar al módulo

1. Abre `http://localhost:3000` e inicia sesión con un usuario **ADMIN**.
2. En el menú lateral, selecciona **Gestión de Usuarios JPA**
   (o navega directo a `http://localhost:3000/Tabla_gestion_usuarios_jpa`).

## Paso 4 — Prueba manual del CRUD

### 4.1 Listar

- Al abrir la vista debe aparecer la tabla con los usuarios, paginada de a 7.
- **Estado de carga**: mientras responde la API se ve el spinner verde.
- **Estado vacío**: si no hay usuarios, la tabla muestra
  "No se encontraron usuarios…".

### 4.2 Crear

1. Botón **"Nuevo Usuario"**.
2. Completa el formulario (los campos con `*` y la contraseña de mínimo 8
   caracteres son obligatorios). Ejemplo:
   - Primer nombre: `Ana`, Primer apellido: `Garcia`
   - Tipo Doc.: `Cédula de Ciudadanía (CC)`, Documento: `1032547896`
   - Celular: `3001234567`, Correo: `ana.garcia@example.com`
   - Contraseña: `super-secret-123`
3. **CREAR USUARIO** → Swal "Usuario creado" y la tabla se recarga.

Pruebas negativas a propósito:

- Deja campos inválidos → errores en línea ⚠️ + Swal "Validación".
- Repite el mismo documento o correo → `409`: el Swal muestra el mensaje de
  la API y el campo conflictivo queda marcado en rojo en el formulario.
- Contraseña con menos de 8 caracteres → validación local + `400` de la API.

### 4.3 Buscar

- Escribe un nombre, apellido o número de documento en el buscador:
  tras ~350 ms sin tipear se consulta el endpoint OR.
- Borra el texto para volver al listado completo.

### 4.4 Editar

1. Botón de lápiz en cualquier fila.
2. El modal se abre precargado; el campo **contraseña queda vacío** — así se
   conserva la actual. Escribe una nueva solo si la quieres cambiar.
3. **GUARDAR CAMBIOS** → Swal "Actualizado" y la tabla se refresca.

### 4.5 Eliminar

1. Botón de papelera → Swal de confirmación
   ("¿Estás seguro?… Sí, eliminar / Cancelar").
2. Al confirmar: `DELETE` → Swal "Eliminado". Si la página queda vacía
   (ej. era el último registro), la vista retrocede automáticamente una
   página en vez de quedarse en blanco.

### 4.6 Errores de servicio

- Apaga el microservicio y recarga la vista → mensaje de conexión con botón
  **Reintentar**. Enciende de nuevo y pulsa Reintentar → la tabla vuelve.
- Si haces muchas solicitudes seguidas y la API responde `429`, el mensaje
  indica los segundos a esperar antes de reintentar.

## Paso 5 — Tests automatizados del módulo

```bash
cd frontend
npm test
```

Incluye los tests del cliente JPA y del servicio
(`frontend/src/services/__tests__/apiJpa.test.js`).

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| "No se pudo conectar con el servicio JPA…" | Microservicio apagado o frontend en un puerto ≠ 3000 (CORS) | Levanta el microservicio en 8080 y el frontend en el 3000 |
| Los cambios del `.env` no aplican | CRA no recarga env en caliente | Reinicia `npm start` |
| La tabla llega vacía en una página alta | Página fuera de rango (la API responde 200 vacío) | La vista lo corrige sola retrocediendo una página |
| Confusión entre "Gestión de Usuarios" y "Gestión de Usuarios JPA" | Son dos backends distintos | La primera consume el Express (:3001); la JPA consume el microservicio (:8080) |
