import { vi, describe, it, expect, beforeEach } from "vitest";

// Misma técnica que el service: require() para compartir la instancia de módulo
// que usa el controller (requiere ./auth.service via require).
const serviceModule = require("../auth.service.js");
const controller = require("../auth.controller.js");

function createRes() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };
  return res;
}

describe("auth.controller", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("login", () => {
    it("returns 400 with 'Faltan campos obligatorios' when fields are empty", async () => {
      // Arrange
      const req = { body: {} };
      const res = createRes();
      const spy = vi
        .spyOn(serviceModule, "validarLogin")
        .mockResolvedValue({ success: true });

      // Act
      await controller.login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Faltan campos obligatorios para el inicio de sesión",
      });
      expect(spy).not.toHaveBeenCalled();
    });

    it("returns 401 with service message when service returns error", async () => {
      // Arrange
      const req = {
        body: { tipo_documento: "CC", documento: "123", contrasena: "clave" },
      };
      const res = createRes();
      vi.spyOn(serviceModule, "validarLogin").mockResolvedValue({
        error: true,
        message: "La contraseña es incorrecta",
      });

      // Act
      await controller.login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "La contraseña es incorrecta",
      });
    });

    it("returns success with token, usuario and rol when service returns success", async () => {
      // Arrange
      const req = {
        body: { tipo_documento: "CC", documento: "123", contrasena: "clave" },
      };
      const res = createRes();
      const usuario = {
        id_usuario: 1,
        primer_nombre: "Juan",
        primer_apellido: "Perez",
        correo_electronico: "juan@test.com",
        rol: "USUARIO",
      };
      vi.spyOn(serviceModule, "validarLogin").mockResolvedValue({
        success: true,
        token: "token-de-prueba",
        usuario,
      });

      // Act
      await controller.login(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Login exitoso",
        token: "token-de-prueba",
        usuario,
        rol: "USUARIO",
      });
    });
  });
});