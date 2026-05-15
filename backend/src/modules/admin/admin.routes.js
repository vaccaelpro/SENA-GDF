const express = require("express");
const router = express.Router();
const controller = require("./admin.controller");

router.get("/usuarios", controller.listarUsuarios);
router.put("/usuarios/:id", controller.actualizarUsuario);
router.delete("/usuarios/:id", controller.eliminarUsuario);

router.get("/GestionUsuarios", controller.test);
router.post("/exportaciones", controller.registrarExportacion);

module.exports = router;
