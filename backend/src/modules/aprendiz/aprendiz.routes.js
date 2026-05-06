const express = require("express");
const router = express.Router();

const controller = require("./aprendiz.controller");

router.get("/test", controller.test);

// Notificaciones
router.get("/notificaciones", controller.obtenerNotificaciones);
router.put("/notificaciones/:id/leida", controller.marcarNotificacionLeida);

// Metas de ahorro
router.get("/metas", controller.obtenerMetas);
router.post("/metas", controller.crearMeta);
router.put("/metas/:id", controller.actualizarMeta);
router.delete("/metas/:id", controller.eliminarMeta);

// Ingresos
router.post("/ingresos", controller.registrarIngreso);

// Bot financiero
router.get("/bot/historial", controller.historialBot);
router.post("/bot/chat", controller.chatBot);

module.exports = router;
