// sequelize.config.cjs
require('dotenv').config();

const isProd =
  process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const sslOpts = isProd || String(process.env.DB_SSL).toLowerCase() === 'true'
  ? { ssl: { require: true, rejectUnauthorized: false } }
  : undefined;

module.exports = {
  development: {
    use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : 'DB_URL',
    dialect: 'postgres',
    dialectOptions: sslOpts
  },
  test: {
    use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : 'DB_URL',
    dialect: 'postgres',
    dialectOptions: sslOpts
  },
  production: {
    use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : 'DB_URL',
    dialect: 'postgres',
    dialectOptions: sslOpts
  }
};
