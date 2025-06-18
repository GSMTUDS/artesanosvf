const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/perfiles');  // carpeta para perfiles
  },
  filename: (req, file, cb) => {
    const nombreFinal = Date.now() + '-' + file.originalname;
    cb(null, nombreFinal);
  }
});

const upload = multer({ storage });

module.exports = upload;