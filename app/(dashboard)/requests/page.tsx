import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";
import { RequestFilters } from "@/components/requests/request-filters";
import { RequestList } from "@/components/requests/request-list";
import { RequestPagination } from "@/components/requests/request-pagination";
import { requireAuthenticatedUser } from "@/lib/auth/authorization";
import { getRequests } from "@/lib/requests/data";
import { requestQuerySchema } from "@/validations/request";

export const metadata: Metadata = { title: "Requests" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const scalar = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function RequestsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireAuthenticatedUser();
  const raw = await searchParams;
  const query = requestQuerySchema.parse({ q: scalar(raw.q), status: scalar(raw.status), page: scalar(raw.page) });
  const result = await getRequests(user, query);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Requests</h2><p className="mt-2 text-sm text-slate-500">Track requests from draft through final review.</p></div><Link className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20" href="/requests/new"><Plus aria-hidden="true" className="size-4" />New request</Link></div>
      <RequestFilters q={query.q} status={query.status} />
      <section aria-label="Requests" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><RequestList filtered={Boolean(query.q || query.status)} requests={result.requests} userId={user.id} /><RequestPagination page={result.page} q={query.q} status={query.status} total={result.total} totalPages={result.totalPages} /></section>
    </div>
  );
}
