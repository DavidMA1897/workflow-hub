import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: "blue" | "amber" | "emerald" | "rose";
};

const tones = {
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
};

export function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value.toLocaleString()}</p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-lg ring-1 ${tones[tone]}`}>
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
    </article>
  );
}
