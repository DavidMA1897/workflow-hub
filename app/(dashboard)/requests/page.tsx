import type { Metadata } from "next";
import { Workflow } from "lucide-react";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export const metadata: Metadata = { title: "Requests" };

export default function RequestsPage() {
  return <PlaceholderPage description="Request creation, tracking, and workflow management will be added in the next product iteration." icon={Workflow} title="Requests are on the way" />;
}
