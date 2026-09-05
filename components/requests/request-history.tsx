import type { RequestStatus } from "@/generated/prisma/client";
import { CircleDot } from "lucide-react";
import { getStatusLabel, StatusBadge } from "@/components/dashboard/status-badge";
import { getActivityLabel } from "@/lib/activity/presentation";

type HistoryItem = { id: string; fromStatus: RequestStatus | null; toStatus: RequestStatus; comment: string | null; createdAt: Date; user: { name: string } };

function date(value: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(value);
}

export function RequestHistory({ history }: { history: HistoryItem[] }) {
  return (
    <section aria-labelledby="history-heading" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-semibold text-slate-950" id="history-heading">History</h2><p className="mt-1 text-sm text-slate-500">A complete audit trail for this request.</p>
      <ol className="mt-6 space-y-0">{history.map((item, index) => <li className="relative flex gap-4 pb-7 last:pb-0" key={item.id}>{index < history.length - 1 && <span aria-hidden="true" className="absolute left-[9px] top-5 h-full w-px bg-slate-200" />}<CircleDot aria-hidden="true" className="relative mt-0.5 size-5 shrink-0 fill-white text-blue-500" /><div className="min-w-0 flex-1"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="text-sm font-semibold text-slate-900">{getActivityLabel(item)}</h3><p className="mt-1 text-xs text-slate-500">{item.user.name} · <time dateTime={item.createdAt.toISOString()}>{date(item.createdAt)}</time></p></div><div className="flex items-center gap-2">{item.fromStatus && <><span className="text-xs text-slate-500">{getStatusLabel(item.fromStatus)} →</span></>}<StatusBadge status={item.toStatus} /></div></div>{item.comment && <blockquote className="mt-3 rounded-lg border-l-2 border-slate-300 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">{item.comment}</blockquote>}</div></li>)}</ol>
    </section>
  );
}
