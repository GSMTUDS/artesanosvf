require('dotenv').config();
const { Album, Imagen, Comentario, sequelize } = require('../models');

async function vaciarContenido() {
  try {
    await sequelize.authenticate();
    console.log("🔌 Conexión establecida correctamente con la base de datos.");

    const comentariosBorrados = await Comentario.destroy({ where: {} });
    console.log(`🧹 Comentarios eliminados: ${comentariosBorrados}`);

    const imagenesBorradas = await Imagen.destroy({ where: {} });
    console.log(`🖼️ Imágenes eliminadas: ${imagenesBorradas}`);

    const albumesBorrados = await Album.destroy({ where: {} });
    console.log(`📁 Álbumes eliminados: ${albumesBorrados}`);

    console.log("✅ Vaciamiento completado.");
    process.exit();
  } catch (error) {
    console.error("❌ Error al vaciar contenido:", error);
    process.exit(1);
  }
}

vaciarContenido();