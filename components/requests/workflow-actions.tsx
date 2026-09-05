"use client";

import { ArrowRight, CheckCircle2, LoaderCircle, PlayCircle, Send, XCircle, type LucideIcon } from "lucide-react";
import { useActionState } from "react";
import { changeRequestStatus, type RequestActionState } from "@/app/actions/requests";
import type { TransitionAction } from "@/validations/request";

const initialState: RequestActionState = {};
const actionPresentation: Record<TransitionAction, { label: string; help: string; icon: LucideIcon; button: string }> = {
  SUBMIT: { label: "Submit for review", help: "Move this draft into the review queue.", icon: Send, button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600/20" },
  START_REVIEW: { label: "Start review", help: "Mark this request as actively under review.", icon: PlayCircle, button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-600/20" },
  APPROVE: { label: "Approve request", help: "Complete the workflow with approval.", icon: CheckCircle2, button: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/20" },
  REJECT: { label: "Reject request", help: "Close the workflow and provide a reason.", icon: XCircle, button: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-600/20" },
};

function WorkflowActionForm({ requestId, action }: { requestId: string; action: TransitionAction }) {
  const [state, formAction, pending] = useActionState(changeRequestStatus, initialState);
  const presentation = actionPresentation[action];
  const Icon = presentation.icon;
  const rejection = action === "REJECT";

  return (
    <form action={formAction} className="rounded-lg border border-slate-200 p-4" noValidate>
      <input name="requestId" type="hidden" value={requestId} />
      <input name="action" type="hidden" value={action} />
      <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600"><Icon aria-hidden="true" className="size-[18px]" /></span><div><h3 className="text-sm font-semibold text-slate-900">{presentation.label}</h3><p className="mt-0.5 text-xs leading-5 text-slate-500">{presentation.help}</p></div></div>
      <label className="mt-4 block text-xs font-medium text-slate-600" htmlFor={`comment-${action}`}>{rejection ? "Rejection reason" : "Comment (optional)"}</label>
      <textarea aria-describedby={state.errors?.comment ? `comment-error-${action}` : undefined} aria-invalid={Boolean(state.errors?.comment)} className="mt-1.5 min-h-20 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" id={`comment-${action}`} maxLength={1000} name="comment" placeholder={rejection ? "Explain why this request is being rejected." : "Add context for this transition."} required={rejection} />
      {state.errors?.comment && <p className="mt-1.5 text-xs text-red-600" id={`comment-error-${action}`}>{state.errors.comment[0]}</p>}
      {state.message && <p aria-live="polite" className="mt-2 text-xs text-red-600" role="alert">{state.message}</p>}
      <button className={`mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-white transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${presentation.button}`} disabled={pending} type="submit">{pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <ArrowRight aria-hidden="true" className="size-4" />}{pending ? "Updating..." : presentation.label}</button>
    </form>
  );
}

export function WorkflowActions({ requestId, actions }: { requestId: string; actions: TransitionAction[] }) {
  if (actions.length === 0) return <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 text-center"><p className="text-sm font-medium text-slate-700">No actions available</p><p className="mt-1 text-xs text-slate-500">This request has no workflow actions available for your role.</p></div>;
  return <div className="space-y-3">{actions.map((action) => <WorkflowActionForm action={action} key={action} requestId={requestId} />)}</div>;
}
