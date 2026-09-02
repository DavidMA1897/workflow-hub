import type { LucideIcon } from "lucide-react";

export function PlaceholderPage({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <section className="py-2 sm:py-4">
      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <span className="grid size-11 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100"><Icon aria-hidden="true" className="size-5" /></span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Coming soon</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </section>
  );
}
