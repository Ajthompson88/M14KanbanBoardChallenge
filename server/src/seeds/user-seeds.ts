// src/seeds/user-seeds.ts
import { User } from '../models/index.js';

export const seedUsers = async () => {
  console.log('User initialized?', !!(User as any).options); // should be true
  await User.bulkCreate(
    [
      { username: 'testUser', password: 'password123' },
      { username: 'JollyGuru', password: 'password' },
      { username: 'SunnyScribe', password: 'password' },
      { username: 'RadiantComet', password: 'password' },
    ],
    { individualHooks: true }
  );
};
