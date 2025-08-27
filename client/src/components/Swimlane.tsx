import TicketCard from './TicketCard';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

type SwimlaneProps = {
  title: string;
  tickets: TicketData[];
  deleteTicket: (ticketId: number) => Promise<ApiMessage>;
};

// Helper to color the count badge based on lane title
function getStatusClass(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('progress')) return 'bg-amber-50 text-amber-700 ring-amber-200';
  if (t.includes('done'))     return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  return 'bg-blue-50 text-blue-700 ring-blue-200'; // default = To Do
}

export default function Swimlane({ title, tickets, deleteTicket }: SwimlaneProps) {
  const badgeClass = getStatusClass(title);

  return (
    <section className="rounded-2xl bg-white/90 ring-1 ring-slate-200 shadow-md">
      <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold tracking-wide text-slate-700 uppercase">
        <span>{title}</span>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeClass}`}>
          {tickets?.length ?? 0}
        </span>
      </div>

      <div className="space-y-3 p-3">
        {tickets?.map((t) => (
          <TicketCard
            key={t.id ?? Math.random()}
            ticket={t}
            deleteTicket={deleteTicket}
          />
        ))}

        {!tickets?.length && (
          <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
            No tickets yet
          </div>
        )}
      </div>
    </section>
  );
}
