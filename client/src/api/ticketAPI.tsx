import { api } from './http';
import type { TicketData } from '../interfaces/TicketData';

// Create/Update payload your backend expects
export type TicketUpsert = {
  name: string;
  description: string;
  status: string;          // e.g. "Todo" | "In Progress" | "Done"
  assignedUserId: number;  // numeric user id
};

export const fetchAllTickets = async (): Promise<TicketData[]> => {
  const { data } = await api.get('/api/tickets');
  return data as TicketData[];
};

export const retrieveTicket = async (id: number): Promise<TicketData> => {
  const { data } = await api.get(`/api/tickets/${id}`);
  return data as TicketData;
};

export const createTicket = async (payload: TicketUpsert): Promise<TicketData> => {
  const { data } = await api.post('/api/tickets', payload);
  return data as TicketData;
};

export const updateTicket = async (id: number, payload: TicketUpsert): Promise<TicketData> => {
  const { data } = await api.put(`/api/tickets/${id}`, payload);
  return data as TicketData;
};

export const deleteTicketById = async (id: number) => {
  const { data } = await api.delete(`/api/tickets/${id}`);
  return data as { message: string };
};
