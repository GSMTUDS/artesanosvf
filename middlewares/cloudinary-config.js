const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storagePerfil = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'artesanos/perfiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  },
});

const storageAlbumes = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'artesanos/albumes',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

const uploadPerfil = multer({ storage: storagePerfil });
const uploadAlbumes = multer({ storage: storageAlbumes });

module.exports = { uploadPerfil, uploadAlbumes };