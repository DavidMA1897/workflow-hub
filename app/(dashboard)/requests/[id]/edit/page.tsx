import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RequestForm } from "@/components/requests/request-form";
import { requireAuthenticatedUser } from "@/lib/auth/authorization";
import { canEditRequest } from "@/lib/requests/access";
import { getRequestById } from "@/lib/requests/data";

export const metadata: Metadata = { title: "Edit request" };

export default async function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;
  const request = await getRequestById(user, id);
  if (!request || !canEditRequest(user, request)) notFound();
  return <div className="mx-auto max-w-3xl space-y-6"><div><Link className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" href={`/requests/${request.id}`}><ArrowLeft aria-hidden="true" className="size-4" />Back to request</Link><h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Edit request</h2><p className="mt-2 text-sm text-slate-500">Update this draft before submitting it for review.</p></div><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><RequestForm request={{ id: request.id, title: request.title, description: request.description }} /></section></div>;
}
