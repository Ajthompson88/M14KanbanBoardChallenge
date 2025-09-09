// server/sequelize.config.cjs
require('dotenv').config();

const common = {
  dialect: 'postgres',
  logging: false,
  define: { underscored: true }
};

const fromUrl = process.env.DATABASE_URL ? {
  url: process.env.DATABASE_URL,
  ...common
} : {
  username: process.env.PGUSER || 'app',
  password: process.env.PGPASSWORD || 'app',
  database: process.env.PGDATABASE || 'kanban',
  host: process.env.PGHOST || 'db',
  port: +(process.env.PGPORT || 5432),
  ...common
};

module.exports = {
  development: fromUrl,
  test: fromUrl,
  production: fromUrl
};
