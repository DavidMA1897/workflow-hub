import type { Metadata } from "next";
import { CheckCircle2, Layers3 } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getAuthenticatedUser } from "@/lib/auth/authorization";

export const metadata: Metadata = { title: "Sign in" };
const demoUsers = [
  { role: "Admin", email: "admin@flowpilot.dev" },
  { role: "Reviewer", email: "reviewer@flowpilot.dev" },
  { role: "User", email: "user@flowpilot.dev" },
];

export default async function LoginPage() {
  if (await getAuthenticatedUser()) redirect("/dashboard");
  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#2563eb_0,transparent_38%),radial-gradient(circle_at_80%_80%,#1e40af_0,transparent_32%)]" />
        <div className="relative flex items-center gap-3 text-xl font-semibold tracking-tight"><span className="grid size-10 place-items-center rounded-xl bg-blue-600"><Layers3 className="size-5" /></span>FlowPilot</div>
        <div className="relative max-w-xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Workflows, simplified</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Move every request forward with clarity.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">A focused workspace for submitting, reviewing, and approving the work that matters.</p>
          <ul className="mt-10 space-y-4 text-sm text-slate-200">
            {["Clear ownership at every step", "Role-based review and approvals", "A complete history of every decision"].map((item) => <li className="flex items-center gap-3" key={item}><CheckCircle2 className="size-5 text-blue-400" />{item}</li>)}
          </ul>
        </div>
        <p className="relative text-sm text-slate-500">Built for teams that value momentum and accountability.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-950 lg:hidden"><span className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white"><Layers3 className="size-5" /></span>FlowPilot</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] sm:p-9">
            <div className="mb-8"><p className="text-sm font-semibold text-blue-600">Welcome back</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Sign in to FlowPilot</h2><p className="mt-2 text-sm leading-6 text-slate-500">Enter your credentials to access your workspace.</p></div>
            <LoginForm />
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Demo credentials</p>
              <div className="mt-3 space-y-2">{demoUsers.map((user) => <div className="flex items-center justify-between gap-3 text-xs" key={user.email}><span className="font-medium text-slate-600">{user.role}</span><code className="text-slate-500">{user.email}</code></div>)}</div>
              <p className="mt-3 text-xs text-slate-400">Password for all accounts: <code>FlowPilot123!</code></p>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">Secure access powered by a signed, HTTP-only session.</p>
        </div>
      </section>
    </main>
  );
}
