import "server-only";

import type { AuthenticatedUser } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import type { TransitionAction } from "@/validations/request";
import { canPerformTransition, transitions } from "./policy";

export { canPerformTransition } from "./policy";

export class WorkflowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkflowError";
  }
}

export async function transitionRequest({
  requestId,
  action,
  comment,
  user,
}: {
  requestId: string;
  action: TransitionAction;
  comment: string;
  user: AuthenticatedUser;
}) {
  const transition = transitions[action];

  return prisma.$transaction(
    async (transaction) => {
      const request = await transaction.request.findUnique({
        where: { id: requestId },
        select: { id: true, createdById: true, status: true },
      });

      if (!request) throw new WorkflowError("This request is not available.");
      if (!canPerformTransition(user, request, action)) {
        throw new WorkflowError(
          "This workflow action is no longer available for this request.",
        );
      }

      const updated = await transaction.request.updateMany({
        where: { id: request.id, status: transition.from },
        data: { status: transition.to },
      });

      if (updated.count !== 1) {
        throw new WorkflowError(
          "The request changed while you were working. Refresh and try again.",
        );
      }

      await transaction.requestHistory.create({
        data: {
          requestId: request.id,
          userId: user.id,
          fromStatus: transition.from,
          toStatus: transition.to,
          comment: comment || null,
        },
      });

      return transition.to;
    },
    { isolationLevel: "Serializable" },
  );
}
