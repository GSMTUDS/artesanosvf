const multer = require('multer');
const path = require('path');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');  // carpeta general para imágenes de álbumes
  },
  filename: (req, file, cb) => {
    const nombreFinal = Date.now() + '-' + file.originalname;
    cb(null, nombreFinal);
  }
});

// Filtro opcional: solo imágenes
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes.'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;