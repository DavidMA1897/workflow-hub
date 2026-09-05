import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RequestForm } from "@/components/requests/request-form";

export const metadata: Metadata = { title: "New request" };

export default function NewRequestPage() {
  return <div className="mx-auto max-w-3xl space-y-6"><div><Link className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" href="/requests"><ArrowLeft aria-hidden="true" className="size-4" />Back to requests</Link><h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Create request</h2><p className="mt-2 text-sm text-slate-500">Start with the details. Every new request begins as a draft.</p></div><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><RequestForm /></section></div>;
}
