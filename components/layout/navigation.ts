import {
  Activity,
  LayoutDashboard,
  Settings,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Requests", href: "/requests", icon: Workflow },
  { label: "Activity", href: "/activity", icon: Activity },
];

export const adminNavigation: NavigationItem = {
  label: "Users",
  href: "/admin/users",
  icon: Users,
};

export const secondaryNavigation: NavigationItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/requests": "Requests",
  "/activity": "Activity",
  "/admin/users": "Users",
  "/settings": "Settings",
};
