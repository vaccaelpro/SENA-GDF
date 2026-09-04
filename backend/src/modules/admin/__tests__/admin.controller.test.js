import { vi, describe, it, expect, beforeEach } from "vitest";

const service = require("../admin.service.js");
const controller = require("../admin.controller.js");

function createRes() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };
  return res;
}

describe("admin.controller", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("listarUsuarios", () => {
    it("responde con los usuarios", async () => {
      const res = createRes();
      vi.spyOn(service, "listarUsuarios").mockResolvedValue([{ id_usuario: 1 }]);

      await controller.listarUsuarios({}, res);

      expect(res.json).toHaveBeenCalledWith([{ id_usuario: 1 }]);
    });

    it("responde 500 ante error de service", async () => {
      const res = createRes();
      vi.spyOn(service, "listarUsuarios").mockRejectedValue(new Error("boom"));

      await controller.listarUsuarios({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al obtener usuarios" });
    });
  });

  describe("crearGrupo", () => {
    it("responde 400 cuando faltan nombre o tipo_apoyo", async () => {
      const res = createRes();
      const spy = vi.spyOn(service, "crearGrupo");

      await controller.crearGrupo({ body: { descripcion: "d" } }, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Faltan campos obligatorios" });
      expect(spy).not.toHaveBeenCalled();
    });

    it("responde 201 cuando el grupo se crea", async () => {
      const res = createRes();
      vi.spyOn(service, "crearGrupo").mockResolvedValue({ success: true, id_grupo: 1, usuarios_agregados: 3 });

      await controller.crearGrupo(
        { body: { nombre: "G", tipo_apoyo: "Transporte" } },
        res
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, id_grupo: 1, usuarios_agregados: 3 });
    });
  });

  describe("crearComunicado", () => {
    it("responde 400 sin titulo o contenido", async () => {
      const res = createRes();
      const spy = vi.spyOn(service, "crearComunicado");

      await controller.crearComunicado({ body: { contenido: "x" } }, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Faltan campos obligatorios (titulo, contenido)" });
      expect(spy).not.toHaveBeenCalled();
    });

    it("responde 201 con el comunicado creado (usa usuario_id por defecto 5)", async () => {
      const res = createRes();
      vi.spyOn(service, "crearComunicado").mockResolvedValue({ success: true, id_comunicado: 3, imagen_url: null });

      await controller.crearComunicado(
        { body: { titulo: "T", contenido: "C" } },
        res
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(service.crearComunicado).toHaveBeenCalledWith(
        { titulo: "T", contenido: "C" },
        5
      );
    });
  });

  describe("obtenerComunicadoPorId", () => {
    it("responde 404 cuando no existe", async () => {
      const res = createRes();
      vi.spyOn(service, "obtenerComunicadoPorId").mockResolvedValue(null);

      await controller.obtenerComunicadoPorId({ params: { id: 999 } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Comunicado no encontrado" });
    });

    it("responde con el comunicado", async () => {
      const res = createRes();
      vi.spyOn(service, "obtenerComunicadoPorId").mockResolvedValue({ id_comunicado: 1 });

      await controller.obtenerComunicadoPorId({ params: { id: 1 } }, res);

      expect(res.json).toHaveBeenCalledWith({ id_comunicado: 1 });
    });
  });

  describe("crearEncuesta", () => {
    it("responde 400 sin titulo o sin preguntas", async () => {
      const res = createRes();
      const spy = vi.spyOn(service, "crearEncuesta");

      await controller.crearEncuesta({ body: { titulo: "", preguntas: [] } }, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Faltan campos obligatorios" });
      expect(spy).not.toHaveBeenCalled();
    });

    it("responde 201 con la encuesta creada", async () => {
      const res = createRes();
      vi.spyOn(service, "crearEncuesta").mockResolvedValue({ success: true, id_formulario: 9 });

      await controller.crearEncuesta(
        { body: { titulo: "E", preguntas: [{ pregunta: "P?" }] } },
        res
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, id_formulario: 9 });
    });
  });

  describe("registrarRespuestas", () => {
    it("responde 400 sin usuario_id o sin respuestas", async () => {
      const res = createRes();
      const spy = vi.spyOn(service, "registrarRespuestas");

      await controller.registrarRespuestas(
        { params: { id: 1 }, body: {} },
        res
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(spy).not.toHaveBeenCalled();
    });

    it("responde 409 cuando el usuario ya respondió", async () => {
      const res = createRes();
      vi.spyOn(service, "registrarRespuestas").mockRejectedValue(
        new Error("El usuario ya respondió esta encuesta")
      );

      await controller.registrarRespuestas(
        { params: { id: 1 }, body: { usuario_id: 2, respuestas: [{}] } },
        res
      );

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "El usuario ya respondió esta encuesta" });
    });

    it("responde con success al registrar", async () => {
      const res = createRes();
      vi.spyOn(service, "registrarRespuestas").mockResolvedValue({ success: true });

      await controller.registrarRespuestas(
        { params: { id: 1 }, body: { usuario_id: 2, respuestas: [{}] } },
        res
      );

      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe("obtenerAnalisisEncuesta", () => {
    it("responde 404 cuando no hay encuesta", async () => {
      const res = createRes();
      vi.spyOn(service, "obtenerAnalisisEncuesta").mockResolvedValue(null);

      await controller.obtenerAnalisisEncuesta({ params: { id: 999 } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("responde con el análisis", async () => {
      const res = createRes();
      vi.spyOn(service, "obtenerAnalisisEncuesta").mockResolvedValue({ encuesta: {} });

      await controller.obtenerAnalisisEncuesta({ params: { id: 1 } }, res);

      expect(res.json).toHaveBeenCalledWith({ encuesta: {} });
    });
  });

  describe("listarEncuestas", () => {
    it("responde con array de encuestas", async () => {
      const res = createRes();
      vi.spyOn(service, "listarEncuestas").mockResolvedValue([{ id_formulario: 1 }]);

      await controller.listarEncuestas({}, res);

      expect(res.json).toHaveBeenCalledWith([{ id_formulario: 1 }]);
    });
  });

  describe("obtenerFinanzasGenerales", () => {
    it("responde con finanzas", async () => {
      const res = createRes();
      vi.spyOn(service, "obtenerFinanzasGenerales").mockResolvedValue([{ id_usuario: 1 }]);

      await controller.obtenerFinanzasGenerales({}, res);

      expect(res.json).toHaveBeenCalledWith([{ id_usuario: 1 }]);
    });
  });
});