console.log("🧭 Ejecutando archivo usuarios.controller.js");

const { Usuario, Perfil, Album, Imagen, Amistad } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');  // 🔧 IMPORTANTE para búsquedas parciales
const fs = require("fs");
const path = require("path");

// Obtener todos los usuarios con su perfil
exports.obtenerTodos = async (req, res) => {
  try {
    console.log("🔍 Entró a GET /usuarios");
    const usuarios = await Usuario.findAll({
      include: { model: Perfil }
    });
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error en GET /usuarios", error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.obtenerPerfilPublico = async (req, res) => {
  const { id } = req.params;
  const { Album, Imagen } = require('../models');

  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil'],
      include: {
        model: Perfil,
        attributes: ['nombre_real', 'intereses', 'biografia']
      }
    });

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const albumes = await Album.findAll({
      where: {
        usuario_id: id,
        visibilidad: 'publica'
      },
      include: [Imagen]
    });

    res.json({ usuario, albumes });
  } catch (error) {
    console.error("❌ Error al obtener perfil público:", error);
    res.status(500).json({ error: "Error al obtener perfil público" });
  }
};

// Búsqueda por nombre de usuario (usado en feed con buscador)
exports.buscarUsuariosPorNombre = async (req, res) => {
  const { nombre } = req.query;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ error: "Falta el parámetro de búsqueda." });
  }

  try {
    const usuarios = await Usuario.findAll({
      where: {
        nombre_usuario: {
          [Op.like]: `%${nombre}%`
        }
      },
      include: {
        model: Perfil,
        attributes: ['nombre_real']
      },
      attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil']
    });

    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al buscar usuarios:", error);
    res.status(500).json({ error: "Error al buscar usuarios" });
  }
};

// Crear usuario y perfil
exports.crear = async (req, res) => {
  const { nombre_usuario, email, contraseña, imagen_perfil, perfil } = req.body;

  if (!nombre_usuario || !email || !contraseña || !perfil) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido) {
    return res.status(400).json({ error: "El formato del email no es válido." });
  }

  if (contraseña.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
  }

  if (!perfil.nombre_real || !perfil.intereses || !perfil.biografia) {
    return res.status(400).json({ error: "El perfil debe incluir nombre real, intereses y biografía." });
  }

  try {
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ error: "El email ya está registrado." });
    }

    const nuevoUsuario = await Usuario.create({
      nombre_usuario,
      email,
      contraseña_hash: contraseña,
      imagen_perfil
    });

    const nuevoPerfil = await Perfil.create({
      usuario_id: nuevoUsuario.id_usuario,
      nombre_real: perfil.nombre_real,
      intereses: perfil.intereses,
      biografia: perfil.biografia
    });

    res.status(201).json({
      usuario: nuevoUsuario,
      perfil: nuevoPerfil
    });

  } catch (error) {
    console.error("❌ Error al crear usuario y perfil:", error);
    res.status(500).json({ error: "No se pudo crear el usuario." });
  }
};

// Login con JWT
exports.login = async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios." });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || usuario.contraseña_hash !== contraseña) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error interno al intentar iniciar sesión." });
  }
};
exports.perfilPrivado = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id_usuario', 'nombre_usuario', 'email', 'imagen_perfil'],
      include: {
        model: Perfil,
        attributes: ['nombre_real', 'intereses', 'biografia']
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Acceso permitido", usuario });
  } catch (error) {
    console.error("❌ Error al obtener perfil privado:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

// POST /usuarios/imagen-perfil
exports.actualizarImagenPerfil = async (req, res) => {
  const usuario_id = req.usuario.id;

  if (!req.file) {
    return res.status(400).json({ error: "No se subió ninguna imagen." });
  }

  try {
    const usuario = await Usuario.findByPk(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Eliminar imagen anterior si no es la por defecto
    if (usuario.imagen_perfil && usuario.imagen_perfil !== "default-avatar.png") {
      const rutaAnterior = path.join(__dirname, "..", usuario.imagen_perfil);
      if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
    }

    // Actualizar
    usuario.imagen_perfil = req.file.path;
    await usuario.save();

    res.json({ mensaje: "Imagen actualizada con éxito", ruta: req.file.path });

  } catch (error) {
    console.error("❌ Error al actualizar imagen:", error);
    res.status(500).json({ error: "No se pudo actualizar la imagen de perfil." });
  }
};
exports.perfilPublico = async (req, res) => {
  const id = parseInt(req.params.id);
  const usuarioActualId = req.usuario.id;

  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil'],
      include: {
        model: Perfil,
        attributes: ['nombre_real', 'intereses', 'biografia']
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si son amigos
    const amistad = await Amistad.findOne({
      where: {
        [Op.or]: [
          { emisor_id: id, receptor_id: usuarioActualId, estado: "aceptada" },
          { emisor_id: usuarioActualId, receptor_id: id, estado: "aceptada" }
        ]
      }
    });

    const albumes = await Album.findAll({
      where: {
        usuario_id: id,
        visibilidad: amistad ? ["publica", "privada"] : "publica"
      },
      include: {
        model: Imagen,
        attributes: ['ruta_archivo']
      }
    });

    res.json({ usuario, albumes });
  } catch (error) {
    console.error("❌ Error al cargar perfil público:", error);
    res.status(500).json({ error: "Error al obtener perfil público" });
  }
};
// GET /usuarios/perfil-publico/:id
exports.perfilPublico = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil'],
      include: {
        model: Album,
        include: [Imagen],
        where: {
          [Op.or]: [
            { visibilidad: 'publica' },
            { visibilidad: 'privada' } // esto se filtra más abajo
          ]
        },
        required: false
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Determinar si son amigos
    const amistad = await Amistad.findOne({
      where: {
        [Op.or]: [
          { emisor_id: req.usuario.id, receptor_id: id, estado: 'aceptada' },
          { emisor_id: id, receptor_id: req.usuario.id, estado: 'aceptada' }
        ]
      }
    });

    const sonAmigos = Boolean(amistad);

    // Filtrar álbumes si no son amigos
    const albumes = usuario.Albums.filter(album =>
      album.visibilidad === 'publica' || sonAmigos
    );

    // Verificar si ya hay una solicitud pendiente
    const solicitud = await Amistad.findOne({
      where: {
        emisor_id: req.usuario.id,
        receptor_id: id,
        estado: 'pendiente'
      }
    });

    res.json({
      usuario,
      albumes,
      sonAmigos,
      solicitudEnviada: Boolean(solicitud)
    });
  } catch (error) {
    console.error("❌ Error en perfil público:", error);
    res.status(500).json({ error: "Error al obtener perfil público" });
  }
};