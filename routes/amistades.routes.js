const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const amistadesController = require('../controllers/amistades.controller');


// Enviar solicitud de amistad
router.post('/solicitar', auth, amistadesController.enviarSolicitud);

// Aceptar o rechazar solicitud
router.post('/responder', auth, amistadesController.responderSolicitud);

// Obtener solicitudes pendientes recibidas
router.get('/pendientes', auth, amistadesController.obtenerSolicitudesPendientes);

module.exports = router;