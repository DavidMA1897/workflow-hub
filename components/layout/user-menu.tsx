"use client";

import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

type UserMenuProps = {
  user: { name: string; email: string; role: string };
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg p-1.5 pr-2 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-details-marker]:hidden">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          {initials(user.name)}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-40 truncate text-sm font-medium text-slate-800">{user.name}</span>
          <span className="block max-w-40 truncate text-xs text-slate-400">{user.email}</span>
        </span>
        <ChevronDown aria-hidden="true" className="hidden size-4 text-slate-400 transition group-open:rotate-180 sm:block" />
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10">
        <div className="border-b border-slate-100 px-3 py-2.5 sm:hidden">
          <p className="truncate text-sm font-medium text-slate-800">{user.name}</p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
        </div>
        <span className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400" aria-disabled="true">
          <UserRound aria-hidden="true" className="size-4" />Profile <span className="ml-auto text-[10px] uppercase tracking-wider">Soon</span>
        </span>
        <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500" href="/settings">
          <Settings aria-hidden="true" className="size-4" />Settings
        </Link>
        <form action={logout} className="mt-1 border-t border-slate-100 pt-1">
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500" type="submit">
            <LogOut aria-hidden="true" className="size-4" />Log out
          </button>
        </form>
      </div>
    </details>
  );
}
