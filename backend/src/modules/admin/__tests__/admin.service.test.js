import { vi, describe, it, expect, beforeEach } from "vitest";

const db = require("../../../config/database");
const service = require("../admin.service.js");

describe("admin.service", () => {
  let dbQuerySpy;

  beforeEach(() => {
    vi.restoreAllMocks();
    dbQuerySpy = vi.spyOn(db, "query");
  });

  describe("listarUsuarios", () => {
    it("retorna las filas de usuarios no admin", async () => {
      const rows = [{ id_usuario: 1, rol: "USUARIO" }];
      dbQuerySpy.mockResolvedValue([rows, []]);

      const result = await service.listarUsuarios();

      expect(result).toEqual(rows);
      expect(dbQuerySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("eliminarUsuario", () => {
    it("retorna success true tras el DELETE", async () => {
      dbQuerySpy.mockResolvedValue([{ affectedRows: 1 }, []]);

      const result = await service.eliminarUsuario(1);

      expect(result).toEqual({ success: true });
      expect(dbQuerySpy).toHaveBeenCalledWith(
        "DELETE FROM usuario WHERE id_usuario = ?",
        [1]
      );
    });
  });

  describe("obtenerFinanzasGenerales", () => {
    it("retorna las filas de finanzas", async () => {
      const rows = [{ id_usuario: 1, total_ingresos: 100, total_gastos: 50 }];
      dbQuerySpy.mockResolvedValue([rows, []]);

      const result = await service.obtenerFinanzasGenerales();

      expect(result).toEqual(rows);
    });
  });

  describe("registrarExportacion", () => {
    it("retorna success con el insertId", async () => {
      dbQuerySpy.mockResolvedValue([{ insertId: 42 }, []]);

      const result = await service.registrarExportacion({
        nombre_archivo: "x.xlsx",
        usuario_id_usuario: 5,
        tipo_exportacion: "finanzas",
      });

      expect(result).toEqual({ success: true, id: 42 });
    });
  });

  describe("obtenerComunicadoPorId", () => {
    it("retorna null cuando no hay comunicado", async () => {
      dbQuerySpy.mockResolvedValue([[], []]);

      const result = await service.obtenerComunicadoPorId(999);

      expect(result).toBeNull();
    });

    it("retorna el comunicado cuando existe", async () => {
      const row = { id_comunicado: 1, titulo: "T" };
      dbQuerySpy.mockResolvedValue([[row], []]);

      const result = await service.obtenerComunicadoPorId(1);

      expect(result).toEqual(row);
    });
  });

  describe("crearEncuesta", () => {
    it("inserta formulario y preguntas, retorna id_formulario", async () => {
      dbQuerySpy
        .mockResolvedValueOnce([{ insertId: 10 }, []]) // INSERT formulario
        .mockResolvedValueOnce([{ insertId: 1 }, []]) // INSERT pregunta 1
        .mockResolvedValueOnce([{ insertId: 2 }, []]); // INSERT pregunta 2

      const result = await service.crearEncuesta({
        titulo: "Encuesta",
        descripcion: "d",
        admin_id: 5,
        preguntas: [{ pregunta: "P1?" }, { pregunta: "P2?" }],
      });

      expect(result).toEqual({ success: true, id_formulario: 10 });
      expect(dbQuerySpy).toHaveBeenCalledTimes(3);
    });

    it("usa admin por defecto (consulta admins) cuando admin_id es inválido", async () => {
      dbQuerySpy
        .mockResolvedValueOnce([[{ id_usuario: 7 }], []]) // SELECT admin
        .mockResolvedValueOnce([{ insertId: 11 }, []]); // INSERT formulario

      const result = await service.crearEncuesta({
        titulo: "E",
        admin_id: 0,
        preguntas: [],
      });

      expect(result).toEqual({ success: true, id_formulario: 11 });
      expect(dbQuerySpy).toHaveBeenCalledWith(
        "SELECT id_usuario FROM usuario WHERE rol = 'ADMIN' LIMIT 1"
      );
    });
  });

  describe("registrarRespuestas", () => {
    it("lanza error de duplicado cuando el usuario ya respondió", async () => {
      dbQuerySpy.mockResolvedValue([[{ id_respuesta: 1 }], []]);

      await expect(
        service.registrarRespuestas({ encuesta_id: 1, usuario_id: 2, respuestas: [] })
      ).rejects.toThrow("El usuario ya respondió esta encuesta");
    });

    it("inserta cada respuesta y retorna success", async () => {
      dbQuerySpy
        .mockResolvedValueOnce([[], []]) // verificación de duplicado
        .mockResolvedValueOnce([{ insertId: 1 }, []]) // respuesta 1
        .mockResolvedValueOnce([{ insertId: 2 }, []]); // respuesta 2

      const result = await service.registrarRespuestas({
        encuesta_id: 1,
        usuario_id: 2,
        respuestas: [
          { respuesta: 8, pregunta_id: 1 },
          { respuesta: 9, pregunta_id: 2 },
        ],
      });

      expect(result).toEqual({ success: true });
      expect(dbQuerySpy).toHaveBeenCalledTimes(3);
    });
  });

  describe("verificarRespuestaUsuario", () => {
    it("retorna true si hay respuesta", async () => {
      dbQuerySpy.mockResolvedValue([[{ id_respuesta: 1 }], []]);
      expect(await service.verificarRespuestaUsuario(1, 2)).toBe(true);
    });

    it("retorna false si no hay respuesta", async () => {
      dbQuerySpy.mockResolvedValue([[], []]);
      expect(await service.verificarRespuestaUsuario(1, 2)).toBe(false);
    });
  });

  describe("obtenerAnalisisEncuesta", () => {
    it("retorna null cuando la encuesta no existe", async () => {
      dbQuerySpy.mockResolvedValue([[], []]);
      expect(await service.obtenerAnalisisEncuesta(999)).toBeNull();
    });

    it("calcula promedio, distribución y comentarios", async () => {
      dbQuerySpy
        .mockResolvedValueOnce([[{ id_formulario: 1, titulo: "T", descripcion: "d", fecha_creacion: "x" }], []]) // encuesta
        .mockResolvedValueOnce([[{ id_pregunta: 1, pregunta: "P1", formulario_id_formulario: 1 }], []]) // preguntas
        .mockResolvedValueOnce([
          [
            { pregunta_id: 1, respuesta: "8", usuario_id: 1, primer_nombre: "A", primer_apellido: "B" },
            { pregunta_id: 1, respuesta: "10", usuario_id: 2, primer_nombre: "C", primer_apellido: "D" },
          ],
          [],
        ]); // respuestas

      const result = await service.obtenerAnalisisEncuesta(1);

      expect(result.total_participantes).toBe(2);
      const pregunta = result.preguntas[0];
      expect(pregunta.promedio).toBe(9);
      expect(pregunta.distribucion).toEqual({ 8: 1, 10: 1 });
    });
  });
});