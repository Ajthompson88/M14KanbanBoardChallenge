// server/src/seeds/index.ts
import { sequelize } from '../models/index.js';
import { seedUsers } from './user-seeds.js';
import { seedTickets } from './ticket-seeds.js';

export async function seedAll() {
  await sequelize.sync({ force: true });
  await seedUsers();
  await seedTickets();
}
