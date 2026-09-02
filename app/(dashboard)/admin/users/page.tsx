import type { Metadata } from "next";
import { Users } from "lucide-react";
import { redirect } from "next/navigation";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";
import { AuthorizationError, requireAdminAccess } from "@/lib/auth/authorization";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  try {
    await requireAdminAccess();
  } catch (error) {
    if (error instanceof AuthorizationError) redirect("/dashboard");
    throw error;
  }

  return <PlaceholderPage description="User administration and role management will be implemented in a later iteration." icon={Users} title="User management is coming" />;
}
