// server/src/seeds/ticket-seeds.ts
import { Ticket } from "../models/index.js";

export async function seedTickets() {
  await Ticket.bulkCreate(
    [
      { name: "Set up auth", status: "Todo",        description: "JWT + guard", assignedUserId: 1 },
      { name: "Build board", status: "In Progress", description: "Columns + drag", assignedUserId: 2 },
      { name: "Polish UI",   status: "Done",        description: "Spacing + icons", assignedUserId: null },
    ],
    { ignoreDuplicates: true }
  );
  console.log("✅ Seeded tickets");
}
