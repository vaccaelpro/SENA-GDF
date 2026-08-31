const express = require('express');
const router = express.Router();
const controller = require('./aprendiz.controller');
const { verifyToken } = require("../../shared/middleware/auth.middleware");

router.get('/test', controller.test);

console.log("Cargando rutas de Aprendiz...");

// Rutas de grupo y chat
router.get('/mi-grupo/:id_usuario', verifyToken, controller.obtenerMiGrupo);
router.get('/mi-grupo/:id_usuario/miembros', verifyToken, controller.obtenerMiembrosMiGrupo);
router.get('/mi-grupo/:id_usuario/mensajes', verifyToken, controller.obtenerMensajesMiGrupo);

// ============= METAS DE AHORRO =============
router.get('/metas/:id_usuario', verifyToken, controller.listarMetas);
router.post('/metas', verifyToken, controller.crearMeta);
router.put('/metas/:id_ahorro', verifyToken, controller.editarMeta);
router.patch('/metas/:id_ahorro/monto', verifyToken, controller.agregarMonto);
router.delete('/metas/:id_ahorro', verifyToken, controller.eliminarMeta);

// ============= INGRESOS Y GASTOS =============
router.get('/ingresos/:id_usuario', verifyToken, controller.listarIngresos);
router.post('/ingresos', verifyToken, controller.crearIngreso);
router.delete('/ingresos/:id_ingreso', verifyToken, controller.eliminarIngreso);

router.get('/gastos/:id_usuario', verifyToken, controller.listarGastos);
router.post('/gastos', verifyToken, controller.crearGasto);
router.delete('/gastos/:id_gasto', verifyToken, controller.eliminarGasto);

module.exports = router;

