import { RequestStatus, UserRole } from "@/generated/prisma/client";
import type { AuthenticatedUser } from "@/lib/auth/authorization";
import type { TransitionAction } from "@/validations/request";

export const transitions: Record<
  TransitionAction,
  { from: RequestStatus; to: RequestStatus }
> = {
  SUBMIT: { from: RequestStatus.DRAFT, to: RequestStatus.SUBMITTED },
  START_REVIEW: {
    from: RequestStatus.SUBMITTED,
    to: RequestStatus.IN_REVIEW,
  },
  APPROVE: { from: RequestStatus.IN_REVIEW, to: RequestStatus.APPROVED },
  REJECT: { from: RequestStatus.IN_REVIEW, to: RequestStatus.REJECTED },
};

export function canPerformTransition(
  user: AuthenticatedUser,
  request: { createdById: string; status: RequestStatus },
  action: TransitionAction,
) {
  const transition = transitions[action];
  if (request.status !== transition.from) return false;
  if (action === "SUBMIT") return request.createdById === user.id;
  return user.role === UserRole.REVIEWER || user.role === UserRole.ADMIN;
}
