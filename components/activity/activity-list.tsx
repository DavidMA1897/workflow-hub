import type { RequestStatus } from "@/generated/prisma/client";
import { Activity, CircleDot, SearchX } from "lucide-react";
import Link from "next/link";
import { getStatusLabel, StatusBadge } from "@/components/dashboard/status-badge";
import { getActivityActorText, getActivityLabel } from "@/lib/activity/presentation";

type ActivityItem = { id: string; fromStatus: RequestStatus | null; toStatus: RequestStatus; comment: string | null; createdAt: Date; request: { id: string; title: string }; user: { name: string } };

function date(value: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(value);
}

export function ActivityList({ items, filtered }: { items: ActivityItem[]; filtered: boolean }) {
  if (items.length === 0) return <div className="flex flex-col items-center px-6 py-16 text-center"><span className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400">{filtered ? <SearchX className="size-5" /> : <Activity className="size-5" />}</span><h2 className="mt-4 font-semibold text-slate-900">{filtered ? "No activity matches your filters" : "No activity yet"}</h2><p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{filtered ? "Try changing the request title or activity type." : "Workflow activity will appear here as requests are created and reviewed."}</p></div>;

  return <ol className="divide-y divide-slate-100">{items.map((item) => <li className="relative flex gap-4 px-5 py-5 sm:px-6" key={item.id}><CircleDot aria-hidden="true" className="mt-0.5 size-5 shrink-0 fill-white text-blue-500" /><div className="min-w-0 flex-1"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><p className="text-sm font-semibold text-slate-900">{getActivityLabel(item)}</p><Link className="mt-1 block truncate text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500" href={`/requests/${item.request.id}`}>{item.request.title}</Link><p className="mt-1 text-xs text-slate-500">{getActivityActorText(item.user.name, item)} · <time dateTime={item.createdAt.toISOString()}>{date(item.createdAt)}</time></p></div><div className="flex shrink-0 items-center gap-2">{item.fromStatus && <span className="text-xs text-slate-500">{getStatusLabel(item.fromStatus)} →</span>}<StatusBadge status={item.toStatus} /></div></div>{item.comment && <blockquote className="mt-3 rounded-lg border-l-2 border-slate-300 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">{item.comment}</blockquote>}</div></li>)}</ol>;
}
