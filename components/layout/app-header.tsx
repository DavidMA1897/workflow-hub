"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { pageTitles } from "./navigation";
import { UserMenu } from "./user-menu";

type AppHeaderProps = {
  onOpenMenu: () => void;
  user: { name: string; email: string; role: string };
};

export function AppHeader({ onOpenMenu, user }: AppHeaderProps) {
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ??
    (pathname.startsWith("/requests/") ? "Requests" : "FlowPilot");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button aria-label="Open navigation menu" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden" onClick={onOpenMenu} type="button">
          <Menu aria-hidden="true" className="size-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">Workspace</p>
          <h1 className="truncate text-base font-semibold text-slate-900">{title}</h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 sm:inline-flex">{user.role}</span>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
