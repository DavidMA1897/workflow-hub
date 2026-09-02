import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export const metadata: Metadata = { title: "Activity" };

export default function ActivityPage() {
  return <PlaceholderPage description="A searchable audit trail of workflow events will be available in a later iteration." icon={Activity} title="Activity history is coming" />;
}
