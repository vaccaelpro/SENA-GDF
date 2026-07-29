const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("./utils/logger");

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Límite grande para base64 de imágenes

// Middleware de logging de peticiones HTTP (sin body para evitar exponer datos sensibles)
app.use((req, _res, next) => {
    logger.request(req);
    next();
});

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const aprendizRoutes = require("./modules/aprendiz/aprendiz.routes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/aprendiz", aprendizRoutes);

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend conectado correctamente" });
});

logger.info('APP', 'Rutas registradas: /api/auth, /api/admin, /api/aprendiz');

module.exports = app;
