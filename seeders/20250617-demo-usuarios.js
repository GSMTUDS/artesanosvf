'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('usuarios', [
      {
        id_usuario: 1,
        nombre_usuario: 'lucasmendez',
        email: 'lucas@example.com',
        contraseña_hash: '1234',
        imagen_perfil: 'uploads/perfiles/lucas.jpg',
        fecha_registro: new Date()
      },
      {
        id_usuario: 2,
        nombre_usuario: 'sofiaramos',
        email: 'sofia@example.com',
        contraseña_hash: '1234',
        imagen_perfil: 'uploads/perfiles/sofia.jpg',
        fecha_registro: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
