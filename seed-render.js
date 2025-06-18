const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

const Usuario = sequelize.define('usuarios', {
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
  nombre_usuario: DataTypes.STRING,
  email: DataTypes.STRING,
  contraseña_hash: DataTypes.STRING,
  imagen_perfil: DataTypes.STRING,
  fecha_registro: DataTypes.DATE
}, { timestamps: false });

const Perfil = sequelize.define('perfiles', {
  id_perfil: { type: DataTypes.INTEGER, primaryKey: true },
  usuario_id: DataTypes.INTEGER,
  nombre_real: DataTypes.STRING,
  intereses: DataTypes.TEXT,
  biografia: DataTypes.TEXT
}, { timestamps: false });

async function insertarDatos() {
  try {
    await sequelize.authenticate();
    console.log('🔌 Conexión establecida con PostgreSQL.');

    const hashLucas = await bcrypt.hash('1234', 10);
    const hashSofia = await bcrypt.hash('1234', 10);

    await Usuario.bulkCreate([
      {
        id_usuario: 1,
        nombre_usuario: 'lucasmendez',
        email: 'lucas@example.com',
        contraseña_hash: hashLucas,
        imagen_perfil: 'uploads/perfiles/lucas.jpg',
        fecha_registro: new Date()
      },
      {
        id_usuario: 2,
        nombre_usuario: 'sofiaramos',
        email: 'sofia@example.com',
        contraseña_hash: hashSofia,
        imagen_perfil: 'uploads/perfiles/sofia.jpg',
        fecha_registro: new Date()
      }
    ]);

    await Perfil.bulkCreate([
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
    ]);

    console.log('✅ Datos insertados correctamente en PostgreSQL');
  } catch (error) {
    console.error('❌ Error al insertar en PostgreSQL:', error);
  } finally {
    await sequelize.close();
  }
}

insertarDatos();
