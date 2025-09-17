// server/src/seeds/user-seeds.ts
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

export async function seedUsers() {
  const h = await bcrypt.hash('pass123', 10);
  await User.bulkCreate([
    { username: 'andrew',   email: 'andrew@example.com',   password_hash: h },
    { username: 'teammate', email: 'teammate@example.com', password_hash: h },
  ]);
  console.log("✅ Seeded users");
}
