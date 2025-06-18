const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const albumesController = require('../controllers/albumes.controller');
const upload = require('../middlewares/uploadImagenesAlbum'); // usa Cloudinary

// Crear álbum con imágenes (máximo 20)
router.post('/', auth, upload.array('imagenes', 20), albumesController.crearAlbumConImagenes);

// Obtener álbumes del usuario autenticado
router.get('/mis-albumes', auth, albumesController.obtenerAlbumesDelUsuario);

// Obtener álbumes públicos para el feed general
router.get('/publicos', albumesController.obtenerAlbumesPublicos);

module.exports = router;