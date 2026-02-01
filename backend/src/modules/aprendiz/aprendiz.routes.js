const express = require("express");
const router = express.Router();

const controller = require("./aprendiz.controller");

// Placeholder para rutas de aprendiz
router.get("/test", controller.test);

// Aquí irán las rutas específicas del aprendiz como:
// - Novedades
// - Encuestas de satisfacción
// - IA Finance
// - Metas de ahorro
// - IA Document
// - Mi grupo
// - Chat

module.exports = router;
