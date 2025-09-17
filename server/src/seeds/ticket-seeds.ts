// server/src/seeds/ticket-seeds.ts
import { Ticket } from '../models/index.js';

export async function seedTickets() {
  await Ticket.bulkCreate([
    { title: 'First Task', description: 'Hello World', status: 'todo', userId: 1 },
  ]);
  console.log("✅ Seeded tickets");
}



