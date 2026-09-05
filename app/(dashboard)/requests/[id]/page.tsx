import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Pencil, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { RequestHistory } from "@/components/requests/request-history";
import { WorkflowActions } from "@/components/requests/workflow-actions";
import { requireAuthenticatedUser } from "@/lib/auth/authorization";
import { canEditRequest } from "@/lib/requests/access";
import { getRequestById } from "@/lib/requests/data";
import { canPerformTransition } from "@/lib/requests/workflow";
import { transitionActions } from "@/validations/request";

export const metadata: Metadata = { title: "Request details" };

function date(value: Date) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(value);
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;
  const request = await getRequestById(user, id);
  if (!request) notFound();
  const availableActions = transitionActions.filter((action) => canPerformTransition(user, request, action));
  const editable = canEditRequest(user, request);

  return (
    <div className="space-y-6">
      <div><Link className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" href="/requests"><ArrowLeft aria-hidden="true" className="size-4" />Back to requests</Link><div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{request.title}</h2><StatusBadge status={request.status} /></div><p className="mt-2 text-sm text-slate-500">Request details and workflow history</p></div>{editable && <Link className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-500/10" href={`/requests/${request.id}/edit`}><Pencil aria-hidden="true" className="size-4" />Edit draft</Link>}</div></div>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold text-slate-950">Description</h2><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">{request.description || "No description was provided."}</p><dl className="mt-7 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3"><div><dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400"><UserRound className="size-3.5" />Created by</dt><dd className="mt-2 truncate text-sm font-medium text-slate-700">{request.createdBy.name}</dd><dd className="truncate text-xs text-slate-400">{request.createdBy.email}</dd></div><div><dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400"><CalendarDays className="size-3.5" />Created</dt><dd className="mt-2 text-sm text-slate-600">{date(request.createdAt)}</dd></div><div><dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400"><CalendarDays className="size-3.5" />Updated</dt><dd className="mt-2 text-sm text-slate-600">{date(request.updatedAt)}</dd></div></dl></section>
          <RequestHistory history={request.history} />
        </div>
        <aside className="min-w-0"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold text-slate-950">Workflow actions</h2><p className="mt-1 text-sm leading-6 text-slate-500">Available actions are based on status, ownership, and role.</p><div className="mt-5"><WorkflowActions actions={availableActions} requestId={request.id} /></div></section></aside>
      </div>
    </div>
  );
}
