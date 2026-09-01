const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");
const { verifyToken } = require("../../shared/middleware/auth.middleware");

console.log("Inicializando rutas de Auth...");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/recuperar", controller.recuperarPassword);
router.post("/restablecer", controller.restablecerPassword);
// Agregamos una nueva ruta para el cierre de sesión
router.post("/logout", verifyToken, controller.logout);

router.get("/test", (req, res) => {
    res.json({ message: "Módulo de autenticación funcionando correctamente" });
});


module.exports = router;
