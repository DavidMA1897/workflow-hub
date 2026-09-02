import type { Metadata } from "next";
import { Layers3, ShieldCheck } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { requireAuthenticatedUser } from "@/lib/auth/authorization";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireAuthenticatedUser();
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"><div className="flex items-center gap-3 font-semibold tracking-tight text-slate-950"><span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white"><Layers3 className="size-5" /></span>FlowPilot</div><form action={logout}><button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-600/10" type="submit">Log out</button></form></div></header>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8"><p className="text-sm font-semibold text-blue-600">Dashboard</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Welcome, {user.name}</h1><p className="mt-3 text-slate-500">Your secure FlowPilot workspace is ready.</p></div>
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck className="size-5" /></span><div><h2 className="font-semibold text-slate-900">Authenticated session</h2><p className="text-sm text-slate-500">Your identity was verified successfully.</p></div></div>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Name</dt><dd className="mt-1 font-medium text-slate-800">{user.name}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</dt><dd className="mt-1 font-medium text-slate-800">{user.email}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Role</dt><dd className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">{user.role}</dd></div></dl>
        </div>
      </section>
    </main>
  );
}
