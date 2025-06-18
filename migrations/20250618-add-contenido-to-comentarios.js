'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('comentarios', 'contenido', {
      type: Sequelize.TEXT,
      allowNull: false,
      after: 'id_comentario' // opcional: ubicación en la tabla
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('comentarios', 'contenido');
  }
};