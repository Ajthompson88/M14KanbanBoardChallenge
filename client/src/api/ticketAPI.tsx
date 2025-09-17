import { api } from "./authAPI";

type Status = "todo" | "in_progress" | "done";

type TicketWrite = {
  title?: string;
  description?: string | null;
  status?: Status;
  userId?: number | null;
};

export async function listTickets() {
  const { data } = await api.get("/tickets");
  return data;
}

export async function retrieveTicket(id: number) {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
}

export async function createTicket(payload: TicketWrite) {
  const { data } = await api.post("/tickets", payload);
  return data;
}

export async function updateTicket(id: number, payload: TicketWrite) {
  const { data } = await api.put(`/tickets/${id}`, payload);
  return data;
}

export async function deleteTicket(id: number) {
  const { data } = await api.delete(`/tickets/${id}`);
  return data;
}

export default { listTickets, retrieveTicket, createTicket, updateTicket, deleteTicket };
