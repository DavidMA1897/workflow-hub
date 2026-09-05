"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import {
  createRequest,
  updateRequest,
  type RequestActionState,
} from "@/app/actions/requests";

const initialState: RequestActionState = {};

export function RequestForm({ request }: { request?: { id: string; title: string; description: string | null } }) {
  const action = request ? updateRequest : createRequest;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {request && <input name="requestId" type="hidden" value={request.id} />}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="title">Title</label>
        <input aria-describedby={state.errors?.title ? "title-error" : "title-help"} aria-invalid={Boolean(state.errors?.title)} autoFocus className="h-11 w-full rounded-lg border border-slate-200 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" defaultValue={request?.title} id="title" maxLength={120} name="title" placeholder="What needs to be reviewed?" type="text" />
        {state.errors?.title ? <p className="mt-1.5 text-sm text-red-600" id="title-error">{state.errors.title[0]}</p> : <p className="mt-1.5 text-xs text-slate-400" id="title-help">3–120 characters</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">Description <span className="font-normal text-slate-400">(optional)</span></label>
        <textarea aria-describedby={state.errors?.description ? "description-error" : "description-help"} aria-invalid={Boolean(state.errors?.description)} className="min-h-40 w-full resize-y rounded-lg border border-slate-200 px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" defaultValue={request?.description ?? ""} id="description" maxLength={2000} name="description" placeholder="Add context, requirements, or useful background information." />
        {state.errors?.description ? <p className="mt-1.5 text-sm text-red-600" id="description-error">{state.errors.description[0]}</p> : <p className="mt-1.5 text-xs text-slate-400" id="description-help">Maximum 2,000 characters</p>}
      </div>
      {state.message && <div aria-live="polite" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.message}</div>}
      <div className="flex justify-end border-t border-slate-100 pt-5">
        <button className="inline-flex h-10 min-w-32 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">{pending && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}{pending ? "Saving..." : request ? "Save changes" : "Create request"}</button>
      </div>
    </form>
  );
}
