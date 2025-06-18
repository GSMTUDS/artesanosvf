// const { Usuario, Album, Imagen, Comentario } = require("../models");
// const fs = require("fs");
// const path = require("path");

// (async () => {
//   try {
//     const usuario = await Usuario.findOne(); // usa el primer usuario disponible
//     if (!usuario) throw new Error("No hay usuarios en la base de datos.");

//     const album = await Album.create({
//       usuario_id: usuario.id_usuario,
//       titulo: "Álbum de prueba",
//       descripcion: "Contenido de testeo",
//       visibilidad: "publico"
//     });

//     const imagen = await Imagen.create({
//       usuario_id: usuario.id_usuario,
//       album_id: album.id_album,
//       ruta_archivo: "uploads/test.jpg",
//       titulo: "Imagen de prueba",
//       descripcion: "Imagen subida manualmente",
//       visibilidad: "publico"
//     });

//     await Comentario.create({
//       usuario_id: usuario.id_usuario,
//       imagen_id: imagen.id_imagen,
//       contenido: "¡Excelente imagen de prueba!"
//     });

//     console.log("✅ Seeder ejecutado correctamente.");
//     process.exit();
//   } catch (err) {
//     console.error("❌ Error al ejecutar seeder:", err);
//     process.exit(1);
//   }
// })();
