'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('perfiles', [
      {
        id_perfil: 1,
        usuario_id: 1,
        nombre_real: 'Lucas Méndez',
        intereses: 'Fotografía, diseño digital',
        biografia: 'Diseñador gráfico autodidacta de Rosario.'
      },
      {
        id_perfil: 2,
        usuario_id: 2,
        nombre_real: 'Sofía Ramos',
        intereses: 'Cerámica, arte textil',
        biografia: 'Artesana textil del sur de Buenos Aires.'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('perfiles', null, {});
  }
};
