"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { login, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">Email address</label>
        <div className="relative">
          <Mail aria-hidden="true" className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input autoComplete="email" autoFocus className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" id="email" name="email" placeholder="you@company.com" type="email" aria-describedby={state.errors?.email ? "email-error" : undefined} aria-invalid={Boolean(state.errors?.email)} />
        </div>
        {state.errors?.email && <p className="mt-1.5 text-sm text-red-600" id="email-error">{state.errors.email[0]}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
        <div className="relative">
          <LockKeyhole aria-hidden="true" className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input autoComplete="current-password" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" id="password" name="password" placeholder="Enter your password" type={showPassword ? "text" : "password"} aria-describedby={state.errors?.password ? "password-error" : undefined} aria-invalid={Boolean(state.errors?.password)} />
          <button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600" onClick={() => setShowPassword((visible) => !visible)} type="button">
            {showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
          </button>
        </div>
        {state.errors?.password && <p className="mt-1.5 text-sm text-red-600" id="password-error">{state.errors.password[0]}</p>}
      </div>
      {state.message && <div aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.message}</div>}
      <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-70" disabled={pending} type="submit">
        {pending && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
