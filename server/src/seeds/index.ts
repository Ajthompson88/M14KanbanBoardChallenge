// src/seeds/index.ts
import { sequelize } from '../models/index.js';
import { seedUsers } from './user-seeds.js';

const seedAll = async () => {
  try {
    console.log('----- DATABASE SYNCING -----');
    await sequelize.sync({ force: true }); // or { alter: true } in dev
    console.log('----- DATABASE SYNCED -----');

    await seedUsers();

    console.log('----- SEED COMPLETE -----');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

seedAll();
