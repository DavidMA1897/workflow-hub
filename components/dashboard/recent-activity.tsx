import type { RequestStatus } from "@/generated/prisma/client";
import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getActivityActorText } from "@/lib/activity/presentation";
import { getStatusLabel, StatusBadge } from "./status-badge";

type ActivityItem = {
  id: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
  createdAt: Date;
  request: { id: string; title: string };
  user: { name: string };
};

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <section aria-labelledby="recent-activity-title" className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6"><h2 className="font-semibold text-slate-950" id="recent-activity-title">Recent activity</h2><p className="mt-1 text-sm text-slate-500">The latest workflow status updates.</p></div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-12 text-center"><span className="grid size-11 place-items-center rounded-full bg-slate-100 text-slate-400"><Activity aria-hidden="true" className="size-5" /></span><h3 className="mt-4 text-sm font-semibold text-slate-800">No activity yet</h3><p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">Workflow updates will appear here once requests begin moving through review.</p></div>
      ) : (
        <ul className="divide-y divide-slate-100">{items.map((item) => <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6" key={item.id}><div className="min-w-0"><Link className="block truncate text-sm font-medium text-slate-900 hover:text-blue-600" href={`/requests/${item.request.id}`}>{item.request.title}</Link><p className="mt-1 text-xs text-slate-500"><span className="font-medium text-slate-600">{getActivityActorText(item.user.name, item)}</span> · <time dateTime={item.createdAt.toISOString()}>{formatTimestamp(item.createdAt)}</time></p></div><div className="flex shrink-0 items-center gap-2">{item.fromStatus && <><span className="text-xs font-medium text-slate-500">{getStatusLabel(item.fromStatus)}</span><ArrowRight aria-hidden="true" className="size-3.5 text-slate-300" /></>}<StatusBadge status={item.toStatus} /></div></li>)}</ul>
      )}
    </section>
  );
}
