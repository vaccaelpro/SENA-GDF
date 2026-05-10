const express = require('express');
const router = express.Router();
const controller = require('./aprendiz.controller');

router.get('/test', controller.test);
console.log("Cargando rutas de Aprendiz...");

// Rutas de grupo y chat
router.get('/mi-grupo/:id_usuario', controller.obtenerMiGrupo);
router.get('/mi-grupo/:id_usuario/miembros', controller.obtenerMiembrosMiGrupo);
router.get('/mi-grupo/:id_usuario/mensajes', controller.obtenerMensajesMiGrupo);

module.exports = router;
