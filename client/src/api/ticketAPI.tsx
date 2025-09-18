// client/src/api/ticketAPI.tsx
import { api } from "./authAPI";

/** API-side status values (wire format) */
export type ApiStatus = "todo" | "in_progress" | "done";

/** UI-to-API upsert payload (UI names; we'll map to API names at the wire) */
export type TicketUpsert = {
  name: string;
  description?: string | null;
  status: ApiStatus;         // API-style status values
  assignedUserId: number;    // UI field; maps to API userId
};

/** Ticket as returned by the API (server shape) */
export type ApiTicket = {
  id: number;
  title: string;
  description: string | null;
  status: ApiStatus;
  userId: number | null;
};

/** Ticket shape used by the UI throughout the app */
export type UiTicket = {
  id: number | null;
  name: string;
  description: string;
  status: ApiStatus;           // keep API enum here; page maps to display labels
  assignedUserId: number | null;
};

/** Map UI -> API payload */
function uiToApiPayload(payload: TicketUpsert): {
  title: string;
  description: string | null | undefined;
  status: ApiStatus;
  userId: number;
} {
  return {
    title: payload.name,
    description: payload.description ?? null,
    status: payload.status,
    userId: payload.assignedUserId,
  };
}

/** Map API -> UI ticket */
function fromApiTicket(t: ApiTicket): UiTicket {
  return {
    id: t.id ?? null,
    name: t.title ?? "",
    description: t.description ?? "",
    status: t.status,
    assignedUserId: t.userId ?? null,
  };
}

// -------- API functions (all strongly typed) --------

export async function listTickets(): Promise<UiTicket[]> {
  const { data } = await api.get<ApiTicket[]>("/tickets");
  return Array.isArray(data) ? data.map(fromApiTicket) : [];
}

export async function retrieveTicket(id: number): Promise<UiTicket> {
  const { data } = await api.get<ApiTicket>(`/tickets/${id}`);
  return fromApiTicket(data);
}

export async function createTicket(payload: TicketUpsert): Promise<UiTicket> {
  const { data } = await api.post<ApiTicket>("/tickets", uiToApiPayload(payload));
  return fromApiTicket(data);
}

export async function updateTicket(id: number, payload: TicketUpsert): Promise<UiTicket> {
  const { data } = await api.put<ApiTicket>(`/tickets/${id}`, uiToApiPayload(payload));
  return fromApiTicket(data);
}

export async function deleteTicket(id: number): Promise<{ success?: boolean } | string | null> {
  const { data } = await api.delete<{ success?: boolean } | string | null>(`/tickets/${id}`);
  return data;
}

// Keep default export so existing imports elsewhere don’t break
export default { listTickets, retrieveTicket, createTicket, updateTicket, deleteTicket };
