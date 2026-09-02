"use client";

import { useState, type ReactNode } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { MobileSidebar } from "./mobile-sidebar";

type AppShellProps = {
  children: ReactNode;
  isAdmin: boolean;
  user: { name: string; email: string; role: string };
};

export function AppShell({ children, isAdmin, user }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 lg:block">
        <AppSidebar isAdmin={isAdmin} />
      </aside>
      <MobileSidebar isAdmin={isAdmin} open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="min-w-0 lg:pl-64">
        <AppHeader onOpenMenu={() => setMobileMenuOpen(true)} user={user} />
        <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
