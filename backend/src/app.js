const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const aprendizRoutes = require("./modules/aprendiz/aprendiz.routes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/aprendiz", aprendizRoutes);

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend conectado correctamente" });
});

module.exports = app;
