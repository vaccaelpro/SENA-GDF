import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";

// Estrategia de mock (proyecto CommonJS):
// Usamos require() para obtener la MISMA instancia de módulo que usa el source
// (auth.service.js usa require("../../config/database")), así vi.spyOn intercepta
// las llamadas reales. import (ESM) crearía una instancia interop SEPARADA.
const db = require("../../../config/database");
const bcrypt = require("bcryptjs");
const service = require("../auth.service.js");

describe("auth.service", () => {
  let dbQuerySpy;
  let bcryptCompareSpy;
  let bcryptHashSpy;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  beforeEach(() => {
    dbQuerySpy = vi.spyOn(db, "query");
    bcryptCompareSpy = vi.spyOn(bcrypt, "compare");
    bcryptHashSpy = vi.spyOn(bcrypt, "hash");
  });

  describe("validarLogin", () => {
    it("returns 'Este usuario no está registrado' when db returns empty rows", async () => {
      // Arrange
      dbQuerySpy.mockResolvedValue([[], []]);

      // Act
      const result = await service.validarLogin("CC", "123", "clave");

      // Assert
      expect(result).toEqual({
        error: true,
        message: "Este usuario no está registrado",
      });
    });

    it("returns 'La contraseña es incorrecta' when bcrypt.compare resolves false", async () => {
      // Arrange
      dbQuerySpy.mockResolvedValue([
        [
          {
            id_usuario: 1,
            primer_nombre: "Juan",
            primer_apellido: "Perez",
            correo_electronico: "juan@test.com",
            rol: "USUARIO",
            contrasena: "hashed",
          },
        ],
        [],
      ]);
      bcryptCompareSpy.mockResolvedValue(false);

      // Act
      const result = await service.validarLogin("CC", "123", "clave");

      // Assert
      expect(result).toEqual({
        error: true,
        message: "La contraseña es incorrecta",
      });
    });

    it("returns success with token and full usuario shape when credentials are valid", async () => {
      // Arrange
      const usuarioRow = {
        id_usuario: 1,
        primer_nombre: "Juan",
        primer_apellido: "Perez",
        correo_electronico: "juan@test.com",
        rol: "USUARIO",
        contrasena: "hashed",
      };
      dbQuerySpy.mockResolvedValue([[usuarioRow], []]);
      bcryptCompareSpy.mockResolvedValue(true);

      // Act
      const result = await service.validarLogin("CC", "123", "clave");

      // Assert
      expect(result.success).toBe(true);
      expect(result.token).toBeTruthy();
      expect(result.usuario).toEqual({
        id_usuario: 1,
        primer_nombre: "Juan",
        primer_apellido: "Perez",
        correo_electronico: "juan@test.com",
        rol: "USUARIO",
      });
    });
  });

  describe("cerrarSesion", () => {
    it("returns success true and message without touching db", async () => {
      // Arrange - nothing to set

      // Act
      const result = await service.cerrarSesion();

      // Assert
      expect(result).toEqual({
        success: true,
        message: "Sesión cerrada correctamente",
      });
      expect(dbQuerySpy).not.toHaveBeenCalled();
    });
  });

  describe("registrarUsuario", () => {
    const data = {
      primer_nombre: "Juan",
      segundo_nombre: "",
      primer_apellido: "Perez",
      segundo_apellido: "",
      tipo_documento: "CC",
      documento: "123",
      celular: "3001234567",
      correo_electronico: "juan@test.com",
      contrasena: "clave",
      grupo_formacion: "12345",
    };

    it("returns duplicate error when existing user is found", async () => {
      // Arrange
      dbQuerySpy.mockResolvedValue([[{ id_usuario: 1 }], []]);

      // Act
      const result = await service.registrarUsuario(data);

      // Assert
      expect(result).toEqual({
        error: true,
        message: "El documento o correo ya se encuentra registrado",
      });
      expect(bcryptHashSpy).not.toHaveBeenCalled();
    });

    it("returns success when no existing user is found", async () => {
      // Arrange
      dbQuerySpy.mockResolvedValueOnce([[], []]); // check existe
      dbQuerySpy.mockResolvedValueOnce([{ affectedRows: 1 }, []]); // insert

      // Act
      const result = await service.registrarUsuario(data);

      // Assert
      expect(result).toEqual({ success: true });
      expect(bcryptHashSpy).toHaveBeenCalledWith("clave", 10);
    });
  });
});