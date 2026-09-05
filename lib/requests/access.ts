import { RequestStatus, UserRole, type Prisma } from "@/generated/prisma/client";
import type { AuthenticatedUser } from "@/lib/auth/authorization";

export class RequestAccessError extends Error {
  constructor(message = "This request is not available.") {
    super(message);
    this.name = "RequestAccessError";
  }
}

export function requestVisibilityWhere(
  user: AuthenticatedUser,
): Prisma.RequestWhereInput {
  return user.role === UserRole.USER ? { createdById: user.id } : {};
}

export function canViewRequest(
  user: AuthenticatedUser,
  request: { createdById: string },
) {
  return user.role !== UserRole.USER || request.createdById === user.id;
}

export function canEditRequest(
  user: AuthenticatedUser,
  request: { createdById: string; status: RequestStatus },
) {
  return request.createdById === user.id && request.status === RequestStatus.DRAFT;
}

export function requireDraftOwnership(
  user: AuthenticatedUser,
  request: { createdById: string; status: RequestStatus },
) {
  if (!canEditRequest(user, request)) throw new RequestAccessError();
}
