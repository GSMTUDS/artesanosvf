'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comentarios', {
      id_comentario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      contenido: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      fecha: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        }
      },
      imagen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'imagenes',
          key: 'id_imagen'
        }
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('comentarios');
  }
};
