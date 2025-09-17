// server/config/config.cjs
require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',              // ✅ REQUIRED
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,    // ok for Render
      },
    },
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
