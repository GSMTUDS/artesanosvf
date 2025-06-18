process.env.NODE_ENV = 'production';
require('dotenv').config();
const { sequelize } = require('../models');

async function limpiarBaseDeDatos() {
  const usuariosPermitidos = [1, 2, 3]; // IDs que se conservan

  try {
    await sequelize.query(`
      DELETE FROM comentarios WHERE usuario_id NOT IN (${usuariosPermitidos.join(',')});
      DELETE FROM comentarios WHERE imagen_id IN (
        SELECT id_imagen FROM imagenes WHERE usuario_id NOT IN (${usuariosPermitidos.join(',')})
      );
      DELETE FROM imagenes WHERE usuario_id NOT IN (${usuariosPermitidos.join(',')});
      DELETE FROM imagenes WHERE album_id IN (
        SELECT id_album FROM albumes WHERE usuario_id NOT IN (${usuariosPermitidos.join(',')})
      );
      DELETE FROM albumes WHERE usuario_id NOT IN (${usuariosPermitidos.join(',')});
    `);

    console.log("✅ Limpieza completada. Solo se conservaron los datos de los usuarios permitidos.");
  } catch (error) {
    console.error("❌ Error al ejecutar limpieza:", error);
  } finally {
    await sequelize.close();
  }
}

limpiarBaseDeDatos();