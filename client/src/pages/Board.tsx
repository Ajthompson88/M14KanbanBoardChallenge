import { useCallback, useEffect, useMemo, useState } from "react";
import Swimlane from "../components/Swimlane";
import { TicketData } from "../interfaces/TicketData";
import * as TicketAPI from "../api/ticketAPI";
import Auth from "../utils/auth";
import { ApiMessage } from "../interfaces/ApiMessage";

/** --- Types that describe the API surface without using `any` --- */
type TicketListPayload = TicketData[] | { tickets: TicketData[] };

interface TicketApiShape {
  getTicketsByStatus?: () => Promise<TicketListPayload>;
  getTickets?: () => Promise<TicketListPayload>;
  deleteTicket?: (id: number) => Promise<unknown>;
}

const api = TicketAPI as unknown as TicketApiShape;

/** Fetch tickets from whichever function your API exposes */
async function fetchAllTickets(): Promise<TicketData[]> {
  if (api.getTicketsByStatus) {
    const res = await api.getTicketsByStatus();
    return Array.isArray(res) ? res : res?.tickets ?? [];
  }
  if (api.getTickets) {
    const res = await api.getTickets();
    return Array.isArray(res) ? res : res?.tickets ?? [];
  }
  // Fallback to REST path
  const token = typeof Auth?.getToken === "function" ? Auth.getToken() : null;
  const r = await fetch("/api/tickets", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await r.json();
  return Array.isArray(data) ? data : data?.tickets ?? [];
}

function normalizeStatus(s?: string | null): "todo" | "progress" | "done" {
  const v = (s ?? "").trim().toLowerCase();
  if (v.includes("progress")) return "progress";
  if (v.includes("done")) return "done";
  return "todo";
}

export default function Board() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await fetchAllTickets();
        if (!alive) return;
        setTickets(list ?? []);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load tickets");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const by = { todo: [] as TicketData[], progress: [] as TicketData[], done: [] as TicketData[] };
    for (const t of tickets) by[normalizeStatus(t.status)].push(t);
    return by;
  }, [tickets]);

  /** Provide the deleteTicket prop expected by Swimlane */
  const handleDelete = useCallback(async (id: number | null | undefined): Promise<ApiMessage> => {
    if (id == null) return Promise.reject(new Error("Invalid ticket ID")); // guard for null in your TicketData.id
    try {
      if (api.deleteTicket) {
        await api.deleteTicket(id);
      }
      // Optimistic update
      setTickets((prev) => prev.filter((t) => t.id !== id));
      return { message: "Ticket deleted successfully" }; // Return a valid ApiMessage
    } catch (error) {
      return Promise.reject(new Error("Failed to delete ticket"));
    }
  }, []);

  // -------- UI --------
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-white/90 ring-1 ring-slate-200 shadow-md p-4">
            <div className="mb-3 h-5 w-28 animate-pulse rounded bg-slate-100" />
            <div className="space-y-3">
              {[0, 1, 2].map((j) => (
                <div key={j} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
          <div className="mb-1 text-sm font-semibold">Couldn’t load tickets</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Swimlane title="To Do"        tickets={grouped.todo}      deleteTicket={handleDelete} />
      <Swimlane title="In Progress"  tickets={grouped.progress}  deleteTicket={handleDelete} />
      <Swimlane title="Done"         tickets={grouped.done}      deleteTicket={handleDelete} />
    </div>
  );
}
