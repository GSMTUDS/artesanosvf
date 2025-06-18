const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Almacenamiento personalizado para imágenes de álbumes
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'artesanos/albumes', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1024, height: 1024, crop: 'limit' }]
  },
});

const upload = multer({ storage });

module.exports = upload;