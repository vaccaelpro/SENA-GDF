import { vi, describe, it, expect, beforeEach } from "vitest";

const service = require("../aprendiz.service.js");
const controller = require("../aprendiz.controller.js");

function createRes() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };
  return res;
}

describe("aprendiz.controller", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("obtenerMiGrupo", () => {
    it("responde 404 cuando el usuario no tiene grupo", async () => {
      const res = createRes();
      vi.spyOn(service, "obtenerMiGrupo").mockResolvedValue(null);

      await controller.obtenerMiGrupo({ params: { id_usuario: 1 } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "No tienes un grupo asignado" });
    });

    it("responde con el grupo", async () => {
      const res = createRes();
      vi.spyOn(service, "obtenerMiGrupo").mockResolvedValue({ id_grupo: 5 });

      await controller.obtenerMiGrupo({ params: { id_usuario: 1 } }, res);

      expect(res.json).toHaveBeenCalledWith({ id_grupo: 5 });
    });
  });

  describe("listarMetas", () => {
    it("responde con metas", async () => {
      const res = createRes();
      vi.spyOn(service, "listarMetas").mockResolvedValue([{ id_ahorro: 1 }]);

      await controller.listarMetas({ params: { id_usuario: 1 } }, res);

      expect(res.json).toHaveBeenCalledWith([{ id_ahorro: 1 }]);
    });

    it("responde 500 ante error", async () => {
      const res = createRes();
      vi.spyOn(service, "listarMetas").mockRejectedValue(new Error("boom"));

      await controller.listarMetas({ params: { id_usuario: 1 } }, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al listar metas" });
    });
  });

  describe("crearMeta", () => {
    it("responde 201 con la meta creada", async () => {
      const res = createRes();
      vi.spyOn(service, "crearMeta").mockResolvedValue({ id_ahorro: 1 });

      await controller.crearMeta({ body: { usuario_id_usuario: 1 } }, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id_ahorro: 1 });
    });
  });

  describe("editarMeta", () => {
    it("responde con la meta editada", async () => {
      const res = createRes();
      vi.spyOn(service, "editarMeta").mockResolvedValue({ id_ahorro: 1, meta: "X" });

      await controller.editarMeta({ params: { id_ahorro: 1 }, body: {} }, res);

      expect(res.json).toHaveBeenCalledWith({ id_ahorro: 1, meta: "X" });
    });
  });

  describe("agregarMonto", () => {
    it("responde con success", async () => {
      const res = createRes();
      vi.spyOn(service, "agregarMonto").mockResolvedValue({ success: true });

      await controller.agregarMonto(
        { params: { id_ahorro: 1 }, body: { monto: 200 } },
        res
      );

      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("responde 500 ante error", async () => {
      const res = createRes();
      vi.spyOn(service, "agregarMonto").mockRejectedValue(new Error("Meta no encontrada"));

      await controller.agregarMonto(
        { params: { id_ahorro: 999 }, body: { monto: 200 } },
        res
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al agregar monto" });
    });
  });

  describe("eliminarMeta", () => {
    it("responde success", async () => {
      const res = createRes();
      vi.spyOn(service, "eliminarMeta").mockResolvedValue({ success: true });

      await controller.eliminarMeta({ params: { id_ahorro: 1 } }, res);

      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe("crearIngreso y crearGasto", () => {
    it("crea ingreso con 201", async () => {
      const res = createRes();
      vi.spyOn(service, "crearIngreso").mockResolvedValue({ id_ingreso: 1 });

      await controller.crearIngreso({ body: { usuario_id_usuario: 1 } }, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id_ingreso: 1 });
    });

    it("crea gasto con 201", async () => {
      const res = createRes();
      vi.spyOn(service, "crearGasto").mockResolvedValue({ id_gasto: 1 });

      await controller.crearGasto({ body: { usuario_id_usuario: 1 } }, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});