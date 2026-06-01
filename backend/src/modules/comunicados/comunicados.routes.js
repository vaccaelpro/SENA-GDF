const express = require('express');
const router = express.Router();
const controller = require('./comunicados.controller');

// Rutas públicas (sin auth)
router.get('/', controller.listarPublicos);

// Rutas de administración
router.get('/admin', controller.listarAdmin);
router.get('/admin/:id', controller.obtenerPorId);
router.post('/admin', controller.crear);
router.put('/admin/:id', controller.actualizar);
router.delete('/admin/:id', controller.eliminar);

module.exports = router;
