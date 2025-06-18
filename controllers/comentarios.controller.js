const { Comentario, Usuario } = require('../models');

// Crear nuevo comentario
exports.crearComentario = async (req, res) => {
  const usuario_id = req.usuario.id;
  const { imagen_id, contenido } = req.body;

  console.log("📝 Intentando comentar", { usuario_id, imagen_id, contenido }); // DEBUG

  if (!imagen_id || !contenido) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const nuevo = await Comentario.create({
      usuario_id,
      imagen_id,
      texto:contenido
    });
    res.status(201).json({ mensaje: "Comentario creado", comentario: nuevo });
  } catch (error) {
    console.error("❌ Error al crear comentario:", error);
    res.status(500).json({ error: "No se pudo crear el comentario." });
  }
};

// Obtener comentarios por imagen
exports.obtenerPorImagen = async (req, res) => {
  const { imagen_id } = req.params;

  try {
    const comentarios = await Comentario.findAll({
      where: { imagen_id },
      include: {
        model: Usuario,
        attributes: ["id_usuario", "nombre_usuario"]
      },
      order: [['fecha', 'DESC']]
    });
    res.json(comentarios);
  } catch (error) {
    console.error("❌ Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios." });
  }
};