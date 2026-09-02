import type { Metadata } from "next";
import { CircleCheckBig, CircleX, ClipboardList, Clock3 } from "lucide-react";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireAuthenticatedUser } from "@/lib/auth/authorization";
import { getDashboardOverview } from "@/lib/dashboard/data";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireAuthenticatedUser();
  const { metrics, recentActivity } = await getDashboardOverview(user);
  const firstName = user.name.trim().split(/\s+/)[0];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Welcome back, {firstName}</h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">Here&apos;s an overview of your workflow activity.</p>
      </section>
      <section aria-label="Request statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total Requests" tone="blue" value={metrics.total} />
        <StatCard icon={Clock3} label="Pending Review" tone="amber" value={metrics.pending} />
        <StatCard icon={CircleCheckBig} label="Approved" tone="emerald" value={metrics.approved} />
        <StatCard icon={CircleX} label="Rejected" tone="rose" value={metrics.rejected} />
      </section>
      <RecentActivity items={recentActivity} />
    </div>
  );
}
