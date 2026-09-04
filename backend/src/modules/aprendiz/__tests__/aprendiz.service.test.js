import { vi, describe, it, expect, beforeEach } from "vitest";

const db = require("../../../config/database");
const service = require("../aprendiz.service.js");

describe("aprendiz.service", () => {
  let dbQuerySpy;

  beforeEach(() => {
    vi.restoreAllMocks();
    dbQuerySpy = vi.spyOn(db, "query");
  });

  describe("obtenerMiGrupo", () => {
    it("retorna null cuando el usuario no existe", async () => {
      dbQuerySpy.mockResolvedValue([[], []]);
      expect(await service.obtenerMiGrupo(1)).toBeNull();
    });

    it("retorna null cuando el usuario no tiene tipo_apoyo", async () => {
      dbQuerySpy.mockResolvedValue([[{ tipo_apoyo: null }], []]);
      expect(await service.obtenerMiGrupo(1)).toBeNull();
    });

    it("retorna el grupo que coincide con tipo_apoyo", async () => {
      dbQuerySpy
        .mockResolvedValueOnce([[{ tipo_apoyo: "Transporte" }], []])
        .mockResolvedValueOnce([[{ id_grupo: 5, nombre: "G1" }], []]);

      const result = await service.obtenerMiGrupo(1);

      expect(result).toEqual({ id_grupo: 5, nombre: "G1" });
    });

    it("retorna null cuando no hay grupo con ese tipo_apoyo", async () => {
      dbQuerySpy
        .mockResolvedValueOnce([[{ tipo_apoyo: "Transporte" }], []])
        .mockResolvedValueOnce([[], []]);

      expect(await service.obtenerMiGrupo(1)).toBeNull();
    });
  });

  describe("obtenerMiembrosMiGrupo", () => {
    it("retorna [] cuando el usuario no tiene tipo_apoyo", async () => {
      dbQuerySpy.mockResolvedValue([[], []]);
      expect(await service.obtenerMiembrosMiGrupo(1)).toEqual([]);
    });

    it("retorna los miembros del grupo", async () => {
      const rows = [{ id_usuario: 2, primer_nombre: "A" }];
      dbQuerySpy
        .mockResolvedValueOnce([[{ tipo_apoyo: "Transporte" }], []])
        .mockResolvedValueOnce([rows, []]);

      expect(await service.obtenerMiembrosMiGrupo(1)).toEqual(rows);
    });
  });

  describe("listarMetas", () => {
    it("retorna las metas del usuario", async () => {
      const rows = [{ id_ahorro: 1, meta: "Viaje" }];
      dbQuerySpy.mockResolvedValue([rows, []]);

      expect(await service.listarMetas(1)).toEqual(rows);
    });
  });

  describe("crearMeta", () => {
    it("retorna la meta creada con id_ahorro", async () => {
      dbQuerySpy.mockResolvedValue([{ insertId: 33 }, []]);

      const result = await service.crearMeta({
        meta: "Viaje",
        valor_objetivo: 1000,
        fecha_objetivo: "2026-12-31",
        usuario_id_usuario: 1,
      });

      expect(result.id_ahorro).toBe(33);
      expect(result.meta).toBe("Viaje");
    });
  });

  describe("eliminarMeta", () => {
    it("retorna success true", async () => {
      dbQuerySpy.mockResolvedValue([{ affectedRows: 1 }, []]);

      expect(await service.eliminarMeta(1)).toEqual({ success: true });
    });
  });

  describe("agregarMonto", () => {
    it("lanza 'Meta no encontrada' cuando la meta no existe", async () => {
      dbQuerySpy.mockResolvedValue([[], []]);

      await expect(service.agregarMonto(999, 100)).rejects.toThrow("Meta no encontrada");
    });

    it("registra el ingreso con descripcion y retorna success", async () => {
      dbQuerySpy
        .mockResolvedValueOnce([[{ usuario_id_usuario: 1, meta: "Viaje" }], []]) // SELECT meta
        .mockResolvedValueOnce([{ affectedRows: 1 }, []]) // UPDATE monto_ahorrado
        .mockResolvedValueOnce([{ insertId: 1 }, []]); // INSERT ingresos con descripcion

      const result = await service.agregarMonto(1, 200);

      expect(result).toEqual({ success: true });
      expect(dbQuerySpy).toHaveBeenCalledTimes(3);
    });

    it("cae al INSERT de fallback sin descripcion cuando el primero falla", async () => {
      dbQuerySpy
        .mockResolvedValueOnce([[{ usuario_id_usuario: 1, meta: "Viaje" }], []]) // SELECT meta
        .mockResolvedValueOnce([{ affectedRows: 1 }, []]) // UPDATE
        .mockRejectedValueOnce(new Error("Unknown column 'descripcion'")) // INSERT con descripcion falla
        .mockResolvedValueOnce([{ insertId: 1 }, []]); // INSERT fallback sin descripcion

      const result = await service.agregarMonto(1, 200);

      expect(result).toEqual({ success: true });
      // 4 queries: SELECT, UPDATE, INSERT(falla), INSERT(fallback)
      expect(dbQuerySpy).toHaveBeenCalledTimes(4);
    });
  });

  describe("listarIngresos y listarGastos", () => {
    it("retorna ingresos", async () => {
      const rows = [{ id_ingreso: 1, monto: 100 }];
      dbQuerySpy.mockResolvedValue([rows, []]);
      expect(await service.listarIngresos(1)).toEqual(rows);
    });

    it("retorna gastos", async () => {
      const rows = [{ id_gasto: 1, monto: 50 }];
      dbQuerySpy.mockResolvedValue([rows, []]);
      expect(await service.listarGastos(1)).toEqual(rows);
    });
  });

  describe("crearIngreso y crearGasto", () => {
    it("crea ingreso y retorna id_ingreso", async () => {
      dbQuerySpy.mockResolvedValue([{ insertId: 7 }, []]);
      const result = await service.crearIngreso({
        monto: 100,
        fecha_registro: "2026-08-26",
        usuario_id_usuario: 1,
      });
      expect(result.id_ingreso).toBe(7);
    });

    it("crea gasto y retorna id_gasto", async () => {
      dbQuerySpy.mockResolvedValue([{ insertId: 8 }, []]);
      const result = await service.crearGasto({
        categoria: "Alimentacion",
        monto: 50,
        fecha_registro: "2026-08-26",
        usuario_id_usuario: 1,
      });
      expect(result.id_gasto).toBe(8);
    });
  });
});