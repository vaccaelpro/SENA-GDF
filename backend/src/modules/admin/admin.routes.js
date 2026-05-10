const express = require("express");
const router = express.Router();
const controller = require("./admin.controller");

router.get("/usuarios", controller.listarUsuarios);
router.put("/usuarios/:id", controller.actualizarUsuario);
router.delete("/usuarios/:id", controller.eliminarUsuario);

router.get("/GestionUsuarios", controller.test);
router.post("/exportaciones", controller.registrarExportacion);

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

module.exports = router;
