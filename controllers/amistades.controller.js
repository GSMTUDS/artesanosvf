const { Amistad, Usuario } = require("../models");

exports.enviarSolicitud = async (req, res) => {
  const emisor_id = req.usuario.id;
  const { receptor_id } = req.body;

  if (!receptor_id) {
    return res.status(400).json({ error: "Falta el ID del destinatario." });
  }

  try {
    const solicitud = await Amistad.create({
      emisor_id,
      receptor_id,
      estado: "pendiente"
    });

    req.io.to(`usuario_${receptor_id}`).emit("nueva_solicitud", {
      emisor_id,
      mensaje: "Tienes una nueva solicitud de amistad."
    });

    res.status(201).json({ mensaje: "Solicitud enviada.", solicitud });
  } catch (error) {
    console.error("❌ Error al enviar solicitud:", error);
    res.status(500).json({ error: "No se pudo enviar la solicitud." });
  }
};

// GET /amistades/pendientes - solicitudes recibidas pendientes
exports.obtenerSolicitudesPendientes = async (req, res) => {
  try {
    const solicitudes = await Amistad.findAll({
      where: {
        receptor_id: req.usuario.id,
        estado: "pendiente"
      },
      include: {
        model: Usuario,
        as: "Emisor", // Este alias DEBE coincidir con el definido en index.js
        attributes: ["id_usuario", "nombre_usuario", "imagen_perfil"]
      }
    });

    res.json(solicitudes);
  } catch (error) {
    console.error("❌ Error al obtener solicitudes pendientes:", error);
    res.status(500).json({ error: "No se pudieron cargar las solicitudes." });
  }
};

exports.responderSolicitud = async (req, res) => {
  const { solicitud_id, respuesta } = req.body;
  const usuario_id = req.usuario.id;

  if (!solicitud_id || !["aceptada", "rechazada"].includes(respuesta)) {
    return res.status(400).json({ error: "Parámetros inválidos." });
  }

  try {
    const solicitud = await Amistad.findOne({
      where: {
        id_amistad: solicitud_id,
        receptor_id: usuario_id,
        estado: "pendiente"
      }
    });

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada." });
    }

    solicitud.estado = respuesta;
    await solicitud.save();

    // Notificar al emisor si fue aceptada o rechazada
    req.io.to(`usuario_${solicitud.emisor_id}`).emit("respuesta_solicitud", {
      estado: respuesta,
      mensaje: `Tu solicitud fue ${respuesta}.`
    });

    res.json({ mensaje: `Solicitud ${respuesta}.`, solicitud });
  } catch (error) {
    console.error("❌ Error al responder solicitud:", error);
    res.status(500).json({ error: "No se pudo procesar la respuesta." });
  }
};
