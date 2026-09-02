"use client";

import { X } from "lucide-react";
import { AppSidebar } from "./app-sidebar";

type MobileSidebarProps = {
  isAdmin: boolean;
  open: boolean;
  onClose: () => void;
};

export function MobileSidebar({ isAdmin, open, onClose }: MobileSidebarProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button aria-label="Close navigation menu" className="absolute inset-0 bg-slate-950/40" onClick={onClose} type="button" />
      <aside aria-label="Mobile sidebar" className="relative h-full w-[min(20rem,85vw)] border-r border-slate-200 bg-white shadow-xl">
        <button aria-label="Close navigation menu" className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={onClose} type="button">
          <X aria-hidden="true" className="size-5" />
        </button>
        <AppSidebar isAdmin={isAdmin} onNavigate={onClose} />
      </aside>
    </div>
  );
}
