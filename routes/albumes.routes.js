const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/authMiddleware');
const albumesController = require('../controllers/albumes.controller');

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const nombreFinal = Date.now() + '-' + file.originalname;
    cb(null, nombreFinal);
  }
});
const upload = multer({ storage });

// Crear álbum con imágenes
router.post('/', auth, upload.array('imagenes', 20), albumesController.crearAlbumConImagenes);

// Obtener álbumes del usuario autenticado
router.get('/mis-albumes', auth, albumesController.obtenerAlbumesDelUsuario);

// (opcional) Obtener álbumes públicos para el feed general
router.get('/publicos', albumesController.obtenerAlbumesPublicos);

module.exports = router;