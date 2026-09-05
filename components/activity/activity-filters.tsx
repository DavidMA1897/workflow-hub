import type { ActivityFilter } from "@/validations/activity";
import { Search } from "lucide-react";

const options: Array<{ value: ActivityFilter | ""; label: string }> = [
  { value: "", label: "All activity" },
  { value: "CREATED", label: "Created" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "IN_REVIEW", label: "Review started" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export function ActivityFilters({ q, status }: { q: string; status?: ActivityFilter }) {
  return (
    <form action="/activity" className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_12rem_auto]" method="get">
      <div><label className="sr-only" htmlFor="activity-search">Search activity by request title</label><div className="relative"><Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" defaultValue={q} id="activity-search" maxLength={100} name="q" placeholder="Search request titles" type="search" /></div></div>
      <div><label className="sr-only" htmlFor="activity-status">Filter activity type</label><select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" defaultValue={status ?? ""} id="activity-status" name="status">{options.map((option) => <option key={option.value || "all"} value={option.value}>{option.label}</option>)}</select></div>
      <button className="h-10 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/15" type="submit">Apply filters</button>
    </form>
  );
}
