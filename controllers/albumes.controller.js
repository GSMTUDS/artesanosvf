const { Album, Imagen, Usuario } = require("../models");
const path = require("path");

exports.crearAlbumConImagenes = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { titulo, descripcion, visibilidad } = req.body;

    if (!titulo || !visibilidad) {
      return res.status(400).json({ error: "El título y la visibilidad del álbum son obligatorios." });
    }

    // Validar visibilidad
    const opcionesValidas = ["publica", "privada"];
    if (!opcionesValidas.includes(visibilidad)) {
      return res.status(400).json({ error: "La visibilidad debe ser 'publica' o 'privada'." });
    }

    // Validar cantidad de imágenes
    if (!req.files || req.files.length < 1 || req.files.length > 20) {
      return res.status(400).json({ error: "Debes subir entre 1 y 20 imágenes." });
    }

    // Crear álbum
    const nuevoAlbum = await Album.create({
      usuario_id,
      titulo,
      descripcion,
      visibilidad,
      fecha_creacion: new Date()
    });

    // Crear imágenes asociadas
    const imagenes = await Promise.all(
      req.files.map(async (file) => {
        return await Imagen.create({
          usuario_id,
          album_id: nuevoAlbum.id_album,
          ruta_archivo: file.path,
          fecha_subida: new Date(),
          visibilidad // misma visibilidad que el álbum
        });
      })
    );

    res.status(201).json({
      mensaje: "Álbum creado con éxito",
      album: nuevoAlbum,
      imagenes
    });

  } catch (error) {
    console.error("❌ Error al crear álbum:", error);
    res.status(500).json({ error: "Error al crear el álbum" });
  }
};

exports.obtenerAlbumesDelUsuario = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    const albumes = await Album.findAll({
      where: { usuario_id },
      include: [{ model: Imagen }],
      order: [["fecha_creacion", "DESC"]]
    });

    res.json(albumes);
  } catch (error) {
    console.error("❌ Error al obtener álbumes:", error);
    res.status(500).json({ error: "Error al obtener álbumes del usuario" });
  }
};

exports.obtenerAlbumesPublicos = async (req, res) => {
  try {
    const albumes = await Album.findAll({
      where: { visibilidad: 'publica' }, // <- importante para el feed
      include: [
        {
          model: Imagen,
          where: { visibilidad: 'publica' },
          required: true
        },
        {
          model: Usuario,
          attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil']
        }
      ],
      order: [["fecha_creacion", "DESC"]]
    });

    res.json(albumes);
  } catch (error) {
    console.error("❌ Error al obtener álbumes públicos:", error);
    res.status(500).json({ error: "Error al obtener álbumes públicos" });
  }
};