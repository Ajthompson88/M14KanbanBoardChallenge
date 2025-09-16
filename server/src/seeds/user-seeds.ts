// server/src/seeds/user-seeds.ts
import { User } from "../models/index.js";

export async function seedUsers() {
  await User.bulkCreate(
    [
      { id: 1, username: "andrew",  email: "andrew@example.com",  password: "pass123" },
      { id: 2, username: "teammate", email: "teammate@example.com", password: "pass123" },
    ],
    { ignoreDuplicates: true }
  );
  console.log("✅ Seeded users");
}
