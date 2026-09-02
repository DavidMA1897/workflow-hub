import { RequestStatus } from "@/generated/prisma/client";

const statusPresentation: Record<RequestStatus, { label: string; className: string }> = {
  [RequestStatus.DRAFT]: { label: "Draft", className: "border-slate-200 bg-slate-50 text-slate-600" },
  [RequestStatus.SUBMITTED]: { label: "Submitted", className: "border-blue-200 bg-blue-50 text-blue-700" },
  [RequestStatus.IN_REVIEW]: { label: "In Review", className: "border-amber-200 bg-amber-50 text-amber-700" },
  [RequestStatus.APPROVED]: { label: "Approved", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  [RequestStatus.REJECTED]: { label: "Rejected", className: "border-rose-200 bg-rose-50 text-rose-700" },
};

export function getStatusLabel(status: RequestStatus) {
  return statusPresentation[status].label;
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const presentation = statusPresentation[status];
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${presentation.className}`}>{presentation.label}</span>;
}
