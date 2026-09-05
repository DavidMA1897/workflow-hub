import { RequestStatus } from "@/generated/prisma/client";

export type ActivityTransition = {
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
};

export function getActivityLabel(activity: ActivityTransition) {
  if (activity.fromStatus === null) return "Request created";

  const transition = `${activity.fromStatus}:${activity.toStatus}`;
  const labels: Record<string, string> = {
    [`${RequestStatus.DRAFT}:${RequestStatus.SUBMITTED}`]:
      "Submitted for review",
    [`${RequestStatus.SUBMITTED}:${RequestStatus.IN_REVIEW}`]:
      "Review started",
    [`${RequestStatus.IN_REVIEW}:${RequestStatus.APPROVED}`]:
      "Request approved",
    [`${RequestStatus.IN_REVIEW}:${RequestStatus.REJECTED}`]:
      "Request rejected",
  };

  return labels[transition] ?? "Status updated";
}

export function getActivityActorText(
  actor: string,
  activity: ActivityTransition,
) {
  return activity.fromStatus === null
    ? `${actor} created this request`
    : `${actor} · ${getActivityLabel(activity)}`;
}
