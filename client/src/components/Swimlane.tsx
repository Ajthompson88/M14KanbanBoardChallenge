import TicketCard from './TicketCard';
import type { TicketData, ApiMessage } from '../interfaces/index.js';

type SwimlaneProps = {
  title: string;
  tickets: TicketData[];
  deleteTicket: (ticketId: number) => Promise<ApiMessage>;
};

function laneBadgeClass(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('progress')) return 'bg-blue-500/15 text-blue-300 ring-blue-500/30';
  if (t.includes('done'))     return 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30';
  return 'bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-[var(--brand-accent)]/30';
}

export default function Swimlane({ title, tickets, deleteTicket }: SwimlaneProps) {
  const badgeClass = laneBadgeClass(title);

  return (
    <section className="rounded-2xl bg-[var(--brand-panel)]/60 ring-1 ring-[var(--brand-ring)] shadow-md">
      <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold tracking-wide text-[var(--brand-muted)] uppercase">
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
          <div className="rounded-lg border border-dashed border-white/10 p-4 text-center text-sm text-[var(--brand-muted)]">
            No tickets yet
          </div>
        )}
      </div>
    </section>
  );
}
