import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.js";
import {
  listTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../../controllers/ticket-controller.js";

export const ticketRouter = Router();

ticketRouter.get("/", authenticateToken, listTickets);
ticketRouter.get("/:id", authenticateToken, getTicket);
ticketRouter.post("/", authenticateToken, createTicket);
ticketRouter.put("/:id", authenticateToken, updateTicket);
ticketRouter.delete("/:id", authenticateToken, deleteTicket);

export default ticketRouter;
