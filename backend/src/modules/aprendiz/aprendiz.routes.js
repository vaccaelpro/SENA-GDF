const express = require('express');
const router = express.Router();
const controller = require('./aprendiz.controller');

router.get('/test', controller.test);
console.log("Cargando rutas de Aprendiz...");

// Rutas de grupo y chat
router.get('/mi-grupo/:id_usuario', controller.obtenerMiGrupo);
router.get('/mi-grupo/:id_usuario/miembros', controller.obtenerMiembrosMiGrupo);
router.get('/mi-grupo/:id_usuario/mensajes', controller.obtenerMensajesMiGrupo);

// ============= METAS DE AHORRO =============
router.get('/metas/:id_usuario', controller.listarMetas);
router.post('/metas', controller.crearMeta);
router.put('/metas/:id_ahorro', controller.editarMeta);
router.patch('/metas/:id_ahorro/monto', controller.agregarMonto);
router.delete('/metas/:id_ahorro', controller.eliminarMeta);

// ============= INGRESOS Y GASTOS =============
router.get('/ingresos/:id_usuario', controller.listarIngresos);
router.post('/ingresos', controller.crearIngreso);
router.delete('/ingresos/:id_ingreso', controller.eliminarIngreso);

router.get('/gastos/:id_usuario', controller.listarGastos);
router.post('/gastos', controller.crearGasto);
router.delete('/gastos/:id_gasto', controller.eliminarGasto);

module.exports = router;

