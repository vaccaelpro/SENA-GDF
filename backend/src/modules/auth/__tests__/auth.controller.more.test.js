import { vi, describe, it, expect, beforeEach } from "vitest";

// Comparte la instancia CJS del service que usa el controller (require).
const serviceModule = require("../auth.service.js");
const controller = require("../auth.controller.js");

function createRes() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };
  return res;
}

const bodyCompleto = {
  primer_nombre: "Juan",
  primer_apellido: "Perez",
  tipo_documento: "CC",
  documento: "1122334455",
  correo_electronico: "juan@test.com",
  contrasena: "Abc12345",
  grupo_formacion: "2691234",
};

describe("auth.controller (métodos no cubiertos)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("login - error inesperado", () => {
    it("responde 500 cuando validarLogin lanza excepción", async () => {
      const req = { body: { tipo_documento: "CC", documento: "123", contrasena: "clave" } };
      const res = createRes();
      vi.spyOn(serviceModule, "validarLogin").mockRejectedValue(new Error("boom"));

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error del servidor al intentar iniciar sesión",
      });
    });
  });

  describe("register", () => {
    it("responde 400 cuando faltan campos obligatorios", async () => {
      const req = { body: { primer_nombre: "Juan" } };
      const res = createRes();
      const spy = vi.spyOn(serviceModule, "registrarUsuario");

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Los campos marcados como obligatorios son necesarios (Nombres, Apellidos, Documento, Correo, Password y Ficha)",
      });
      expect(spy).not.toHaveBeenCalled();
    });

    it("responde 400 cuando el service reporta duplicado", async () => {
      const req = { body: bodyCompleto };
      const res = createRes();
      vi.spyOn(serviceModule, "registrarUsuario").mockResolvedValue({
        error: true,
        message: "El documento o correo ya se encuentra registrado",
      });

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "El documento o correo ya se encuentra registrado",
      });
    });

    it("responde 201 cuando el registro es exitoso", async () => {
      const req = { body: bodyCompleto };
      const res = createRes();
      vi.spyOn(serviceModule, "registrarUsuario").mockResolvedValue({ success: true });

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Usuario registrado correctamente",
      });
    });

    it("responde 500 cuando registrarUsuario lanza excepción", async () => {
      const req = { body: bodyCompleto };
      const res = createRes();
      vi.spyOn(serviceModule, "registrarUsuario").mockRejectedValue(new Error("boom"));

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error al procesar el registro del usuario",
      });
    });
  });

  describe("recuperarPassword", () => {
    it("responde 400 cuando falta el correo", async () => {
      const req = { body: {} };
      const res = createRes();
      const spy = vi.spyOn(serviceModule, "generarTokenRecuperacion");

      await controller.recuperarPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Correo requerido" });
      expect(spy).not.toHaveBeenCalled();
    });

    it("responde 200 cuando el correo es válido", async () => {
      const req = { body: { correo: "juan@test.com" } };
      const res = createRes();
      vi.spyOn(serviceModule, "generarTokenRecuperacion").mockResolvedValue({ success: true });

      await controller.recuperarPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Correo de recuperación enviado" });
    });

    it("responde 500 con el mensaje del error cuando el service lanza", async () => {
      const req = { body: { correo: "nadie@test.com" } };
      const res = createRes();
      vi.spyOn(serviceModule, "generarTokenRecuperacion").mockRejectedValue(
        new Error("Correo no registrado")
      );

      await controller.recuperarPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Correo no registrado" });
    });
  });

  describe("restablecerPassword", () => {
    it("responde 200 con mensaje de actualización", async () => {
      const req = { body: { token: "tok", nuevaContrasena: "NuevaPass123" } };
      const res = createRes();
      vi.spyOn(serviceModule, "cambiarPassword").mockResolvedValue({ success: true });

      await controller.restablecerPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Contraseña actualizada" });
    });

    it("responde 400 con 'Token inválido o expirado' cuando cambiarPassword lanza", async () => {
      const req = { body: { token: "invalido", nuevaContrasena: "NuevaPass123" } };
      const res = createRes();
      vi.spyOn(serviceModule, "cambiarPassword").mockRejectedValue(new Error("Token inválido"));

      await controller.restablecerPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Token inválido o expirado" });
    });
  });

  describe("logout", () => {
    it("responde con success true y 'Sesión cerrada'", async () => {
      const req = {};
      const res = createRes();
      vi.spyOn(serviceModule, "cerrarSesion").mockResolvedValue({ success: true });

      await controller.logout(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Sesión cerrada" });
    });

    it("responde 400 con mensaje de error cuando cerrarSesion lanza", async () => {
      const req = {};
      const res = createRes();
      vi.spyOn(serviceModule, "cerrarSesion").mockRejectedValue(new Error("fallo"));

      await controller.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "fallo" });
    });
  });
});