import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// Integración supertest: prueba las RUTAS reales y sus firmas con middleware verifyToken.
// La BD se aísla espiando los services (misma instancia CJS que usan los controllers).
// El token se firma con el mismo JWT_SECRET que verifyToken lee de process.env.
const jwt = require("jsonwebtoken");
const request = require("supertest");

const adminService = require("../admin.service.js");
const app = require("../../../app.js");

const SECRET = "test-secret-integracion";

function tokenAdmin() {
  return jwt.sign({ id: 5, rol: "ADMIN" }, SECRET, { expiresIn: "1h" });
}

describe("integración /api/admin (supertest)", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("verificarRespuestaUsuario (endpoint con 2 params)", () => {
    it("GET /api/admin/encuestas/:id/verificar/:usuario_id responde {yaRespondio}", async () => {
      vi.spyOn(adminService, "verificarRespuestaUsuario").mockResolvedValue(false);

      const res = await request(app)
        .get("/api/admin/encuestas/1/verificar/2")
        .set("Authorization", `Bearer ${tokenAdmin()}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ yaRespondio: false });
    });
  });

  describe("listarComunicadosPublicos", () => {
    it("GET /api/admin/comunicados responde array", async () => {
      vi.spyOn(adminService, "listarComunicadosPublicos").mockResolvedValue([
        { id_comunicado: 1, titulo: "Novedad" },
      ]);

      const res = await request(app)
        .get("/api/admin/comunicados")
        .set("Authorization", `Bearer ${tokenAdmin()}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id_comunicado: 1, titulo: "Novedad" }]);
    });
  });

  describe("crearGrupo (validación 400 en ruta)", () => {
    it("POST /api/admin/grupos sin nombre responde 400", async () => {
      const spy = vi.spyOn(adminService, "crearGrupo");

      const res = await request(app)
        .post("/api/admin/grupos")
        .set("Authorization", `Bearer ${tokenAdmin()}`)
        .send({ descripcion: "sin nombre" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Faltan campos obligatorios" });
      expect(spy).not.toHaveBeenCalled();
    });

    it("POST /api/admin/grupos válido responde 201", async () => {
      vi.spyOn(adminService, "crearGrupo").mockResolvedValue({
        success: true,
        id_grupo: 1,
        usuarios_agregados: 0,
      });

      const res = await request(app)
        .post("/api/admin/grupos")
        .set("Authorization", `Bearer ${tokenAdmin()}`)
        .send({ nombre: "G1", tipo_apoyo: "Transporte" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ success: true, id_grupo: 1, usuarios_agregados: 0 });
    });
  });

  describe("security: rutas protegidas exigen token", () => {
    it("GET /api/admin/usuarios sin token responde 401", async () => {
      const res = await request(app).get("/api/admin/usuarios");

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Token de sesión requerido",
      });
    });

    it("GET /api/admin/usuarios con token inválido responde 401", async () => {
      const res = await request(app)
        .get("/api/admin/usuarios")
        .set("Authorization", "Bearer token-invalido");

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Token inválido o expirado",
      });
    });

    it("GET /api/admin/usuarios con token válido responde 200", async () => {
      vi.spyOn(adminService, "listarUsuarios").mockResolvedValue([
        { id_usuario: 1, rol: "USUARIO" },
      ]);

      const res = await request(app)
        .get("/api/admin/usuarios")
        .set("Authorization", `Bearer ${tokenAdmin()}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id_usuario: 1, rol: "USUARIO" }]);
    });
  });

  describe("registrarRespuestas (409 en ruta)", () => {
    it("POST /api/admin/encuestas/:id/respuestas duplicado responde 409", async () => {
      vi.spyOn(adminService, "registrarRespuestas").mockRejectedValue(
        new Error("El usuario ya respondió esta encuesta")
      );

      const res = await request(app)
        .post("/api/admin/encuestas/1/respuestas")
        .set("Authorization", `Bearer ${tokenAdmin()}`)
        .send({ usuario_id: 2, respuestas: [{}] });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: "El usuario ya respondió esta encuesta" });
    });
  });
});