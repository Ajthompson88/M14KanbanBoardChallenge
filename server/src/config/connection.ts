// src/config/connection.ts
import { Sequelize } from 'sequelize';
import 'dotenv/config';

const dbUrl = process.env.DB_URL;
// Or use discrete env vars if you prefer:
// const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

export const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        // Only use SSL in production
        ssl: process.env.NODE_ENV === 'production' 
          ? { require: true, rejectUnauthorized: false }
          : false
      },
    })
  : new Sequelize(
      process.env.DB_NAME as string,
      process.env.DB_USER as string,
      process.env.DB_PASSWORD as string,
      {
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: false  // No SSL for local development
        }
      }
    );