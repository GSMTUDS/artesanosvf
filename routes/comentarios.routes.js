const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const comentariosController = require("../controllers/comentarios.controller");

// Crear un comentario
router.post("/", auth, comentariosController.crearComentario);

// Obtener comentarios de una imagen
router.get("/:imagen_id", auth, comentariosController.obtenerPorImagen);

module.exports = router;