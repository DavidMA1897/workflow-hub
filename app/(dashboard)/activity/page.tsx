import type { Metadata } from "next";
import { ActivityFilters } from "@/components/activity/activity-filters";
import { ActivityList } from "@/components/activity/activity-list";
import { ActivityPagination } from "@/components/activity/activity-pagination";
import { requireAuthenticatedUser } from "@/lib/auth/authorization";
import { getActivity } from "@/lib/activity/data";
import { activityQuerySchema } from "@/validations/activity";

export const metadata: Metadata = { title: "Activity" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const scalar = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function ActivityPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireAuthenticatedUser();
  const raw = await searchParams;
  const query = activityQuerySchema.parse({ q: scalar(raw.q), status: scalar(raw.status), page: scalar(raw.page) });
  const result = await getActivity(user, query);
  return <div className="space-y-6"><div><h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Activity</h2><p className="mt-2 text-sm text-slate-500">Review the complete audit trail across your visible requests.</p></div><ActivityFilters q={query.q} status={query.status} /><section aria-label="Workflow activity" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><ActivityList filtered={Boolean(query.q || query.status)} items={result.items} /><ActivityPagination page={result.page} q={query.q} status={query.status} total={result.total} totalPages={result.totalPages} /></section></div>;
}
