// // tools/cleanup.js
// const db = require('../models');
// const usuario_id = 3; // ← poné el ID del usuario a limpiar

// (async () => {
//   try {
//     // Traer todos los álbumes del usuario
//     const albumes = await db.Album.findAll({
//       where: { usuario_id },
//       include: [db.Imagen]
//     });

//     for (const album of albumes) {
//       for (const imagen of album.Imagens) {
//         // Borrar comentarios asociados
//         await db.Comentario.destroy({ where: { imagen_id: imagen.id_imagen } });
//         // Borrar imagen
//         await imagen.destroy();
//       }
//       // Borrar álbum
//       await album.destroy();
//     }

//     console.log("✅ Álbumes, imágenes y comentarios eliminados correctamente.");
//     process.exit();
//   } catch (err) {
//     console.error("❌ Error al eliminar:", err);
//     process.exit(1);
//   }
// })();