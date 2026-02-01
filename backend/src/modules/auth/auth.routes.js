const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");

console.log("Inicializando rutas de Auth...");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/recuperar", controller.recuperarPassword);
router.post("/restablecer", controller.restablecerPassword);

router.get("/test", (req, res) => {
    res.json({ message: "Módulo de autenticación funcionando correctamente" });
});

module.exports = router;
