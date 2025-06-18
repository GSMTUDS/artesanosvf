require('dotenv').config();
const { parse } = require('pg-connection-string');

const config = {};

if (process.env.DATABASE_URL) {
  const parsed = parse(process.env.DATABASE_URL);
  config.production = {
    username: parsed.user,
    password: parsed.password,
    database: parsed.database,
    host: parsed.host,
    port: parsed.port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  };
} else {
  config.development = {
    username: 'root',
    password: '',
    database: 'artesanos',
    host: 'localhost',
    dialect: 'mysql'
  };
}

module.exports = config;