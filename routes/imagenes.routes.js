const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Imagen } = require('../models');
const auth = require('../middlewares/authMiddleware');

// Configuración de multer para subir archivos a /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const nombreFinal = Date.now() + '-' + file.originalname;
    cb(null, nombreFinal);
  }
});
const upload = multer({ storage });

// POST /imagenes - subir una imagen
/* router.post('/', auth, upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, descripcion, visibilidad } = req.body;
    const usuario_id = req.usuario.id;

    // Validar visibilidad
    const opcionesVisibilidad = ['publica', 'compartida', 'privada'];
    if (!opcionesVisibilidad.includes(visibilidad)) {
      return res.status(400).json({ error: "La visibilidad debe ser pública, compartida o privada." });
    }

    const nuevaImagen = await Imagen.create({
      usuario_id,
      ruta_archivo: req.file.path,
      titulo,
      descripcion,
      visibilidad,
      album_id,
      fecha_subida: new Date()
    });

    res.status(201).json({ mensaje: "Imagen subida correctamente", imagen: nuevaImagen });
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    res.status(500).json({ error: "Error al subir la imagen", detalle: error.message });

  }
}); */

module.exports = router;