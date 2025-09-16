// server/src/seeds/index.ts
import "dotenv/config";
import { sequelize } from "../config/connection.js";
import { initModels } from "../models/index.js";
import { seedUsers } from "./user-seeds.js";
import { seedTickets } from "./ticket-seeds.js";

async function main() {
  await sequelize.authenticate();
  initModels(sequelize);
  await sequelize.sync({ alter: true });     // or { alter: true } while developing
  await seedUsers();
  await seedTickets();
  await sequelize.close();
  console.log("🌱 Seeding complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export {}; // mark this file as a module (silences TS "not a module")
