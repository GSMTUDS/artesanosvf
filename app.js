const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

require('dotenv').config();
const http = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const db = require('./models');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta raíz que sirve el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login-con-redireccion.html'));
});

// Inyectar io en cada request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use('/usuarios', require('./routes/usuarios.routes'));
app.use('/albumes', require('./routes/albumes.routes'));
app.use('/amistades', require('./routes/amistades.routes'));
app.use('/comentarios', require('./routes/comentarios.routes'));

// WebSocket con validación JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No autorizado'));
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.usuario_id = decoded.id;
    next();
  } catch (error) {
    next(new Error('Token inválido'));
  }
});

io.on('connection', (socket) => {
  console.log(`📡 Usuario conectado ID: ${socket.usuario_id}`);
  socket.join(`usuario_${socket.usuario_id}`);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
  http.listen(PORT, () => {
    console.log('✅ Rutas de usuarios cargadas');
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
