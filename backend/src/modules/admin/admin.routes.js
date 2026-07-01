const express = require("express");
const router = express.Router();
const controller = require("./admin.controller");

router.get("/usuarios", controller.listarUsuarios);
router.put("/usuarios/:id", controller.actualizarUsuario);
router.delete("/usuarios/:id", controller.eliminarUsuario);

router.get("/GestionUsuarios", controller.test);
router.post("/exportaciones", controller.registrarExportacion);

// Finanzas generales
router.get("/finanzas", controller.obtenerFinanzasGenerales);

router.post("/grupos", controller.crearGrupo);
router.get("/grupos", controller.listarGrupos);
router.put("/grupos/:id", controller.actualizarGrupo);
router.delete("/grupos/:id", controller.eliminarGrupo);

router.get("/grupos/:id/mensajes", controller.obtenerMensajesGrupo);
router.post("/grupos/:id/mensajes", controller.enviarMensajeGrupo);
router.put("/mensajes/:id", controller.actualizarMensajeGrupo);
router.delete("/mensajes/:id", controller.eliminarMensajeGrupo);
router.get("/grupos/:id", controller.obtenerDetalleGrupo);
router.get("/grupos/:id/miembros", controller.obtenerMiembrosGrupo);

// Comunicados / Novedades
router.get("/comunicados", controller.listarComunicadosPublicos);
router.get("/comunicados/admin", controller.listarComunicadosAdmin);
router.get("/comunicados/admin/:id", controller.obtenerComunicadoPorId);
router.post("/comunicados/admin", controller.crearComunicado);
router.put("/comunicados/admin/:id", controller.actualizarComunicado);
router.delete("/comunicados/admin/:id", controller.eliminarComunicado);

// Encuestas
router.get("/encuestas", controller.listarEncuestas);
router.post("/encuestas", controller.crearEncuesta);
router.get("/encuestas/:id", controller.obtenerEncuesta);
router.delete("/encuestas/:id", controller.eliminarEncuesta);
router.post("/encuestas/:id/respuestas", controller.registrarRespuestas);
router.get("/encuestas/:id/analisis", controller.obtenerAnalisisEncuesta);
router.get("/encuestas/:id/verificar/:usuario_id", controller.verificarRespuestaUsuario);

module.exports = router;

