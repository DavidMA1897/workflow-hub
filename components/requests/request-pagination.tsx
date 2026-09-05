import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

function pageHref(page: number, q: string, status?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/requests?${query}` : "/requests";
}

export function RequestPagination({ page, totalPages, total, q, status }: { page: number; totalPages: number; total: number; q: string; status?: string }) {
  if (total === 0) return null;
  const linkClass = "inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <nav aria-label="Request pagination" className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm text-slate-500">Page <span className="font-medium text-slate-700">{page}</span> of <span className="font-medium text-slate-700">{totalPages}</span> · {total} {total === 1 ? "request" : "requests"}</p>
      <div className="flex gap-2">
        {page > 1 ? <Link className={linkClass} href={pageHref(page - 1, q, status)}><ChevronLeft aria-hidden="true" className="size-4" />Previous</Link> : <span aria-disabled="true" className={`${linkClass} cursor-not-allowed opacity-45`}><ChevronLeft aria-hidden="true" className="size-4" />Previous</span>}
        {page < totalPages ? <Link className={linkClass} href={pageHref(page + 1, q, status)}>Next<ChevronRight aria-hidden="true" className="size-4" /></Link> : <span aria-disabled="true" className={`${linkClass} cursor-not-allowed opacity-45`}>Next<ChevronRight aria-hidden="true" className="size-4" /></span>}
      </div>
    </nav>
  );
}
