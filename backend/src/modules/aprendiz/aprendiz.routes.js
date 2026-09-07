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

// ============= IA FINANCE =============
router.post('/ia-finance/chat', verifyToken, controller.chatIA);
router.get('/ia-finance/historial/:id_usuario', verifyToken, controller.obtenerHistorialIA);
router.get('/ia-finance/alerta/:id_usuario', verifyToken, controller.evaluarAlerta);

// ============= BENEFICIO METRO (VALIDADOR IA) =============
const jwt = require("jsonwebtoken");
const docMetroCtrl = require('./documentoMetro.controller');

const authMetroSuave = (req, res, next) => {
    const token = req.headers["authorization"]?.replace("Bearer ", "") || req.query?.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = { id: decoded.id, rol: decoded.rol };
        } catch (e) {
            // Si el token expira, no forzamos 401 para no cerrar sesión al usuario abruptamente
        }
    }
    next();
};

router.post('/documento-metro/analizar', authMetroSuave, docMetroCtrl.analizarDocumento);
router.get('/documento-metro/mis-solicitudes', authMetroSuave, docMetroCtrl.obtenerMisSolicitudes);
router.get('/documento-metro/plantilla', docMetroCtrl.descargarPlantilla);
router.get('/documento-metro/:id/descargar', authMetroSuave, docMetroCtrl.descargarArchivo);

module.exports = router;

