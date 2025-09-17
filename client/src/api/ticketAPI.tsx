// src/http/ticketAPI.tsx
import http from './http';
import type { TicketData } from '../interfaces/index.js';

// Create/Update payload your backend expects
export type TicketUpsert = {
  name: string;
  description: string;
  status: string;          // "Todo" | "In Progress" | "Done"
  assignedUserId: number;  // numeric user id
};

export const fetchAllTickets = async (): Promise<TicketData[]> => {
  const { data } = await http.get('/tickets');
  return data as TicketData[];
};

export const retrieveTicket = async (id: number): Promise<TicketData> => {
  const { data } = await http.get(`/tickets/${id}`);
  return data as TicketData;
};

export const createTicket = async (payload: TicketUpsert): Promise<TicketData> => {
  const { data } = await http.post('/tickets', payload);
  return data as TicketData;
};

export const updateTicket = async (id: number, payload: TicketUpsert): Promise<TicketData> => {
  const { data } = await http.put(`/tickets/${id}`, payload);
  return data as TicketData;
};

export const deleteTicketById = async (id: number) => {
  const { data } = await http.delete(`/tickets/${id}`);
  return data as { message: string };
};
