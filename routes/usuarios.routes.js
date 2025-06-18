const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const auth = require('../middlewares/authMiddleware');
const uploadPerfil = require('../middlewares/uploadImagenPerfil');

// Obtener todos los usuarios
router.get('/', usuariosController.obtenerTodos);

// Buscar usuarios por nombre (para el buscador del feed)
router.get('/buscar', auth, usuariosController.buscarUsuariosPorNombre);

// Registro de usuario
router.post('/', usuariosController.crear);

// Login
router.post('/login', usuariosController.login);

// Obtener perfil privado (usuario logueado)
router.get('/privado', auth, usuariosController.perfilPrivado);

// Actualizar imagen de perfil
router.post('/imagen-perfil', auth, uploadPerfil.single('imagen'), usuariosController.actualizarImagenPerfil);

// Obtener perfil público (con visibilidad de álbumes y relación)
router.get('/perfil-publico/:id', auth, usuariosController.perfilPublico);

module.exports = router;