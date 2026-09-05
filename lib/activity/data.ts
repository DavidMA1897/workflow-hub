import "server-only";

import { RequestStatus, UserRole, type Prisma } from "@/generated/prisma/client";
import type { AuthenticatedUser } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import type { ActivityQuery } from "@/validations/activity";

export const ACTIVITY_PER_PAGE = 15;

export async function getActivity(
  user: AuthenticatedUser,
  query: ActivityQuery,
) {
  const requestFilter: Prisma.RequestWhereInput = {
    ...(user.role === UserRole.USER ? { createdById: user.id } : {}),
    ...(query.q
      ? { title: { contains: query.q, mode: "insensitive" } }
      : {}),
  };
  const where: Prisma.RequestHistoryWhereInput = {
    request: requestFilter,
    ...(query.status === "CREATED"
      ? { fromStatus: null }
      : query.status
        ? { toStatus: query.status as RequestStatus }
        : {}),
  };

  const total = await prisma.requestHistory.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / ACTIVITY_PER_PAGE));
  const page = Math.min(query.page, totalPages);
  const items = await prisma.requestHistory.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * ACTIVITY_PER_PAGE,
    take: ACTIVITY_PER_PAGE,
    select: {
      id: true,
      fromStatus: true,
      toStatus: true,
      comment: true,
      createdAt: true,
      request: { select: { id: true, title: true } },
      user: { select: { name: true } },
    },
  });

  return { items, total, totalPages, page };
}
