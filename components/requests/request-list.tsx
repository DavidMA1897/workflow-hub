import type { RequestStatus } from "@/generated/prisma/client";
import { FileText, Pencil, Plus, SearchX } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/status-badge";

type RequestRow = {
  id: string;
  title: string;
  description: string | null;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: { name: string; email: string };
};

function date(value: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(value);
}

function RowActions({ request, userId }: { request: RequestRow; userId: string }) {
  const editable = request.createdById === userId && request.status === "DRAFT";
  return <div className="flex items-center gap-2"><Link className="rounded-md px-2.5 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" href={`/requests/${request.id}`}>View</Link>{editable && <Link aria-label={`Edit ${request.title}`} className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" href={`/requests/${request.id}/edit`}><Pencil aria-hidden="true" className="size-4" /></Link>}</div>;
}

export function RequestList({ requests, userId, filtered }: { requests: RequestRow[]; userId: string; filtered: boolean }) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400">{filtered ? <SearchX className="size-5" /> : <FileText className="size-5" />}</span>
        <h2 className="mt-4 font-semibold text-slate-900">{filtered ? "No requests match your filters" : "No requests yet"}</h2>
        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{filtered ? "Try changing the search term or status filter." : "Create your first request to start a new workflow."}</p>
        {!filtered && <Link className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20" href="/requests/new"><Plus className="size-4" />Create your first request</Link>}
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full table-fixed text-left">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500"><tr><th className="w-[34%] px-5 py-3">Request</th><th className="w-[14%] px-4 py-3">Status</th><th className="w-[20%] px-4 py-3">Created by</th><th className="w-[11%] px-4 py-3">Created</th><th className="w-[11%] px-4 py-3">Updated</th><th className="w-[10%] px-4 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{requests.map((request) => <tr className="transition hover:bg-slate-50/70" key={request.id}><td className="px-5 py-4"><Link className="block truncate text-sm font-semibold text-slate-900 hover:text-blue-600" href={`/requests/${request.id}`}>{request.title}</Link>{request.description && <p className="mt-1 truncate text-xs text-slate-500">{request.description}</p>}</td><td className="px-4 py-4"><StatusBadge status={request.status} /></td><td className="px-4 py-4"><p className="truncate text-sm font-medium text-slate-700">{request.createdBy.name}</p><p className="truncate text-xs text-slate-400">{request.createdBy.email}</p></td><td className="px-4 py-4 text-sm text-slate-500">{date(request.createdAt)}</td><td className="px-4 py-4 text-sm text-slate-500">{date(request.updatedAt)}</td><td className="px-4 py-4"><RowActions request={request} userId={userId} /></td></tr>)}</tbody>
        </table>
      </div>
      <ul className="divide-y divide-slate-100 md:hidden">{requests.map((request) => <li className="p-4" key={request.id}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link className="block truncate text-sm font-semibold text-slate-900" href={`/requests/${request.id}`}>{request.title}</Link><p className="mt-1 truncate text-xs text-slate-500">{request.description || "No description"}</p></div><StatusBadge status={request.status} /></div><div className="mt-4 flex items-end justify-between gap-4"><div className="min-w-0 text-xs text-slate-500"><p className="truncate font-medium text-slate-600">{request.createdBy.name}</p><p className="mt-1">Updated {date(request.updatedAt)}</p></div><RowActions request={request} userId={userId} /></div></li>)}</ul>
    </>
  );
}
