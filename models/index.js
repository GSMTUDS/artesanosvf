const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  dialectOptions: config.dialectOptions || {},
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Modelos
db.Usuario = require('./usuario')(sequelize, Sequelize.DataTypes);
db.Perfil = require('./perfil')(sequelize, Sequelize.DataTypes);
db.Album = require('./album')(sequelize, Sequelize.DataTypes);
db.Imagen = require('./imagen')(sequelize, Sequelize.DataTypes);
db.Amistad = require('./amistad')(sequelize, Sequelize.DataTypes);

// Relaciones de Usuario y Perfil
db.Usuario.hasOne(db.Perfil, { foreignKey: 'usuario_id' });
db.Perfil.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

// Usuario - Imagen
db.Usuario.hasMany(db.Imagen, { foreignKey: 'usuario_id' });
db.Imagen.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

// Usuario - Álbum
db.Usuario.hasMany(db.Album, { foreignKey: 'usuario_id' });
db.Album.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

// Álbum - Imagen
db.Album.hasMany(db.Imagen, { foreignKey: 'album_id' });
db.Imagen.belongsTo(db.Album, { foreignKey: 'album_id' });

// Relaciones de amistad
db.Usuario.hasMany(db.Amistad, { foreignKey: 'emisor_id', as: 'solicitudes_enviadas' });
db.Usuario.hasMany(db.Amistad, { foreignKey: 'receptor_id', as: 'solicitudes_recibidas' });
db.Amistad.belongsTo(db.Usuario, { foreignKey: 'emisor_id', as: 'Emisor' });
db.Amistad.belongsTo(db.Usuario, { foreignKey: 'receptor_id', as: 'Receptor' });

// de comentarios
db.Comentario = require('./comentario')(sequelize, Sequelize.DataTypes);
db.Imagen.hasMany(db.Comentario, { foreignKey: 'imagen_id' });
db.Comentario.belongsTo(db.Imagen, { foreignKey: 'imagen_id' });
db.Usuario.hasMany(db.Comentario, { foreignKey: 'usuario_id' });
db.Comentario.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });
module.exports = db;


