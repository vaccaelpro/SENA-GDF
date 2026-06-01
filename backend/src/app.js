const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Límite grande para base64 de imágenes

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const aprendizRoutes = require("./modules/aprendiz/aprendiz.routes");
const comunicadosRoutes = require("./modules/comunicados/comunicados.routes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/aprendiz", aprendizRoutes);
app.use("/api/comunicados", comunicadosRoutes);

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend conectado correctamente" });
});

module.exports = app;
