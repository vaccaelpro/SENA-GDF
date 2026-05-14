const express = require("express");
const router = express.Router();
const controller = require("./admin.controller");

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ------------------------------------------------------------------------
// CONFIGURACIÓN DE SUBIDA DE ARCHIVOS (MULTER)
// ------------------------------------------------------------------------
// Multer es un middleware que nos ayuda a procesar peticiones 'multipart/form-data',
// lo cual es necesario cuando se envían archivos (como imágenes) desde el frontend.

const uploadDir = path.join(__dirname, '../../../public/uploads');

// Verificamos si la carpeta de destino existe, si no, la creamos automáticamente
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento: 
// - destination: Indica en qué carpeta física del backend se guardarán las imágenes.
// - filename: Genera un nombre único para el archivo (fecha actual + número aleatorio) para evitar sobreescritura.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir) 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
// Instancia de upload que usaremos en las rutas para procesar un solo archivo llamado 'imagen'
const upload = multer({ storage: storage });

router.get("/usuarios", controller.listarUsuarios);
router.put("/usuarios/:id", controller.actualizarUsuario);
router.delete("/usuarios/:id", controller.eliminarUsuario);

router.get("/GestionUsuarios", controller.test);
router.post("/exportaciones", controller.registrarExportacion);

// ------------------------------------------------------------------------
// RUTAS PARA GESTIÓN DE COMUNICADOS (NOVEDADES)
// ------------------------------------------------------------------------
// Estas rutas definen los endpoints (URLs) del backend con los que el frontend se comunica.
// El middleware `upload.single('imagen')` procesa el archivo enviado y lo guarda antes de pasar al controlador.

// Ruta para obtener todos los comunicados (Lectura)
router.get("/comunicados", controller.listarComunicados);

// Ruta para crear un nuevo comunicado (Sube una imagen y guarda en base de datos)
router.post("/comunicados", upload.single('imagen'), controller.crearComunicado);

// Ruta para actualizar un comunicado existente (Puede subir una nueva imagen y reemplaza los datos)
router.put("/comunicados/:id", upload.single('imagen'), controller.actualizarComunicado);

// Ruta para eliminar un comunicado (Por su ID)
router.delete("/comunicados/:id", controller.eliminarComunicado);

module.exports = router;
