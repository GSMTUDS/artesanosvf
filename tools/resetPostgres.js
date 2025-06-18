const db = require("../models");

async function resetPostgres() {
  try {
    await db.Comentario.destroy({ where: {}, truncate: true, restartIdentity: true });
    await db.Imagen.destroy({ where: {}, truncate: true, restartIdentity: true });
    await db.Album.destroy({ where: {}, truncate: true, restartIdentity: true });

    console.log("✅ Limpieza completa en PostgreSQL");
  } catch (err) {
    console.error("❌ Error durante la limpieza:", err);
  } finally {
    await db.sequelize.close();
  }
}

resetPostgres();