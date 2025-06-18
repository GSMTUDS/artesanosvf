console.log("🧭 Ejecutando archivo usuarios.controller.js");

const { Usuario, Perfil, Album, Imagen, Amistad } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
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

// Búsqueda por nombre de usuario
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

    const hash = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = await Usuario.create({
      nombre_usuario,
      email,
      contraseña_hash: hash,
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

// Login con JWT y comparación de hash
exports.login = async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios." });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const passwordValid = await bcrypt.compare(contraseña, usuario.contraseña_hash);
    if (!passwordValid) {
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

// Perfil privado
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

// Actualizar imagen de perfil
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

    if (usuario.imagen_perfil && usuario.imagen_perfil !== "default-avatar.png") {
      const rutaAnterior = path.join(__dirname, "..", usuario.imagen_perfil);
      if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
    }

    usuario.imagen_perfil = req.file.path;
    await usuario.save();

    res.json({ mensaje: "Imagen actualizada con éxito", ruta: req.file.path });

  } catch (error) {
    console.error("❌ Error al actualizar imagen:", error);
    res.status(500).json({ error: "No se pudo actualizar la imagen de perfil." });
  }
};

// Perfil público
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
            { visibilidad: 'publico' },
            { visibilidad: 'privado' }
          ]
        },
        required: false
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const amistad = await Amistad.findOne({
      where: {
        [Op.or]: [
          { emisor_id: req.usuario.id, receptor_id: id, estado: 'aceptada' },
          { emisor_id: id, receptor_id: req.usuario.id, estado: 'aceptada' }
        ]
      }
    });

    const sonAmigos = Boolean(amistad);

    const albumes = usuario.Albums.filter(album =>
      album.visibilidad === 'publico' || sonAmigos
    );

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