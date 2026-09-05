import "server-only";

import { RequestStatus, UserRole } from "@/generated/prisma/client";
import type { AuthenticatedUser } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function getDashboardOverview(user: AuthenticatedUser) {
  const requestWhere =
    user.role === UserRole.USER ? { createdById: user.id } : undefined;

  const [statusGroups, recentActivity] = await Promise.all([
    prisma.request.groupBy({
      by: ["status"],
      where: requestWhere,
      _count: { _all: true },
    }),
    prisma.requestHistory.findMany({
      where:
        user.role === UserRole.USER
          ? { request: { createdById: user.id } }
          : undefined,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fromStatus: true,
        toStatus: true,
        createdAt: true,
        request: { select: { id: true, title: true } },
        user: { select: { name: true } },
      },
    }),
  ]);

  const counts = new Map(
    statusGroups.map(({ status, _count }) => [status, _count._all]),
  );
  const count = (status: RequestStatus) => counts.get(status) ?? 0;

  return {
    metrics: {
      total: statusGroups.reduce((total, group) => total + group._count._all, 0),
      pending:
        count(RequestStatus.SUBMITTED) + count(RequestStatus.IN_REVIEW),
      approved: count(RequestStatus.APPROVED),
      rejected: count(RequestStatus.REJECTED),
    },
    recentActivity,
  };
}
