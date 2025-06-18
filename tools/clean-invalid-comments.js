// const { Comentario, Imagen, Usuario } = require("../models");

// (async () => {
//   try {
//     const comentarios = await Comentario.findAll();

//     for (const c of comentarios) {
//       const imagen = await Imagen.findByPk(c.imagen_id);
//       const usuario = await Usuario.findByPk(c.usuario_id);

//       if (!imagen || !usuario) {
//         console.log(`🗑️ Eliminando comentario inválido id=${c.id_comentario}`);
//         await c.destroy();
//       }
//     }

//     console.log("✅ Comentarios inválidos eliminados.");
//     process.exit();
//   } catch (err) {
//     console.error("❌ Error al limpiar comentarios:", err);
//     process.exit(1);
//   }
// })();
