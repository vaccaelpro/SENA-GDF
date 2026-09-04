import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// Integración supertest del módulo auth (rutas reales, service mockeado).
const request = require("supertest");
const jwt = require("jsonwebtoken");

const authService = require("../auth.service.js");
const app = require("../../../app.js");

const SECRET = "test-secret-integracion";

describe("integración /api/auth (supertest)", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("responde 400 con campos vacíos", async () => {
      const res = await request(app).post("/api/auth/login").send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("responde 401 cuando el service reporta error", async () => {
      vi.spyOn(authService, "validarLogin").mockResolvedValue({
        error: true,
        message: "La contraseña es incorrecta",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ tipo_documento: "CC", documento: "123", contrasena: "x" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("La contraseña es incorrecta");
    });

    it("responde 200 con token y rol", async () => {
      vi.spyOn(authService, "validarLogin").mockResolvedValue({
        success: true,
        token: "tok",
        usuario: { id_usuario: 1, rol: "USUARIO" },
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ tipo_documento: "CC", documento: "123", contrasena: "x" });

      expect(res.status).toBe(200);
      expect(res.body.rol).toBe("USUARIO");
      expect(res.body.token).toBe("tok");
    });
  });

  describe("POST /api/auth/register", () => {
    it("responde 400 con campos obligatorios vacíos", async () => {
      const res = await request(app).post("/api/auth/register").send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("responde 201 cuando el registro es exitoso", async () => {
      vi.spyOn(authService, "registrarUsuario").mockResolvedValue({ success: true });

      const res = await request(app).post("/api/auth/register").send({
        primer_nombre: "Juan",
        primer_apellido: "Perez",
        tipo_documento: "CC",
        documento: "1122",
        correo_electronico: "j@test.com",
        contrasena: "Abc12345",
        grupo_formacion: "2691234",
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        message: "Usuario registrado correctamente",
      });
    });

    it("responde 400 con documento duplicado", async () => {
      vi.spyOn(authService, "registrarUsuario").mockResolvedValue({
        error: true,
        message: "El documento o correo ya se encuentra registrado",
      });

      const res = await request(app).post("/api/auth/register").send({
        primer_nombre: "Juan",
        primer_apellido: "Perez",
        tipo_documento: "CC",
        documento: "1122",
        correo_electronico: "j@test.com",
        contrasena: "Abc12345",
        grupo_formacion: "2691234",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/recuperar", () => {
    it("responde 400 sin correo", async () => {
      const res = await request(app).post("/api/auth/recuperar").send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Correo requerido" });
    });

    it("responde 200 con correo válido", async () => {
      vi.spyOn(authService, "generarTokenRecuperacion").mockResolvedValue({ success: true });

      const res = await request(app)
        .post("/api/auth/recuperar")
        .send({ correo: "j@test.com" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Correo de recuperación enviado" });
    });
  });

  describe("POST /api/auth/restablecer", () => {
    it("responde 200 con token válido", async () => {
      vi.spyOn(authService, "cambiarPassword").mockResolvedValue({ success: true });

      const res = await request(app)
        .post("/api/auth/restablecer")
        .send({ token: "tok", nuevaContrasena: "Nueva123" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Contraseña actualizada" });
    });

    it("responde 400 con token inválido", async () => {
      vi.spyOn(authService, "cambiarPassword").mockRejectedValue(new Error("Token inválido"));

      const res = await request(app)
        .post("/api/auth/restablecer")
        .send({ token: "malo", nuevaContrasena: "Nueva123" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Token inválido o expirado" });
    });
  });

  describe("POST /api/auth/logout (protegido con verifyToken)", () => {
    it("responde 401 sin token", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.status).toBe(401);
    });

    it("responde 200 con token válido", async () => {
      vi.spyOn(authService, "cerrarSesion").mockResolvedValue({ success: true });
      const token = jwt.sign({ id: 5, rol: "ADMIN" }, SECRET, { expiresIn: "1h" });

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, message: "Sesión cerrada" });
    });
  });
});