import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <PlaceholderPage description="Workspace preferences and profile settings will be introduced in a future iteration." icon={Settings} title="Settings are coming soon" />;
}
