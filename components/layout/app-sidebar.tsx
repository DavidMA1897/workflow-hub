"use client";

import { Layers3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  adminNavigation,
  primaryNavigation,
  secondaryNavigation,
  type NavigationItem,
} from "./navigation";

type AppSidebarProps = {
  isAdmin: boolean;
  onNavigate?: () => void;
};

function NavLink({ item, onNavigate }: { item: NavigationItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
      href={item.href}
      onClick={onNavigate}
    >
      <Icon aria-hidden="true" className="size-[18px] shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export function AppSidebar({ isAdmin, onNavigate }: AppSidebarProps) {
  const mainItems = isAdmin
    ? [...primaryNavigation, adminNavigation]
    : primaryNavigation;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-5">
        <span className="grid size-9 place-items-center rounded-lg bg-blue-600 text-white">
          <Layers3 aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold tracking-tight text-slate-950">FlowPilot</p>
          <p className="truncate text-[11px] font-medium text-slate-400">Workflow Management</p>
        </div>
      </div>
      <nav aria-label="Primary navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
        {mainItems.map((item) => <NavLink item={item} key={item.href} onNavigate={onNavigate} />)}
      </nav>
      <nav aria-label="Secondary navigation" className="shrink-0 border-t border-slate-200 p-3">
        {secondaryNavigation.map((item) => <NavLink item={item} key={item.href} onNavigate={onNavigate} />)}
      </nav>
    </div>
  );
}
