import { RequestStatus } from "@/generated/prisma/client";
import { Search } from "lucide-react";
import { getStatusLabel } from "@/components/dashboard/status-badge";

export function RequestFilters({ q, status }: { q: string; status?: RequestStatus }) {
  return (
    <form action="/requests" className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_12rem_auto]" method="get">
      <div>
        <label className="sr-only" htmlFor="request-search">Search requests</label>
        <div className="relative">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" defaultValue={q} id="request-search" maxLength={100} name="q" placeholder="Search title or description" type="search" />
        </div>
      </div>
      <div>
        <label className="sr-only" htmlFor="status-filter">Filter by status</label>
        <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" defaultValue={status ?? ""} id="status-filter" name="status">
          <option value="">All statuses</option>
          {Object.values(RequestStatus).map((value) => <option key={value} value={value}>{getStatusLabel(value)}</option>)}
        </select>
      </div>
      <button className="h-10 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/15" type="submit">Apply filters</button>
    </form>
  );
}
