import "server-only";

import { type Prisma } from "@/generated/prisma/client";
import type { AuthenticatedUser } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import type { RequestQuery } from "@/validations/request";
import { requestVisibilityWhere } from "./access";

export const REQUESTS_PER_PAGE = 10;

export async function getRequests(
  user: AuthenticatedUser,
  query: RequestQuery,
) {
  const filters: Prisma.RequestWhereInput = {
    ...requestVisibilityWhere(user),
    ...(query.status ? { status: query.status } : {}),
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: "insensitive" } },
            { description: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const total = await prisma.request.count({ where: filters });
  const totalPages = Math.max(1, Math.ceil(total / REQUESTS_PER_PAGE));
  const page = Math.min(query.page, totalPages);
  const requests = await prisma.request.findMany({
    where: filters,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * REQUESTS_PER_PAGE,
    take: REQUESTS_PER_PAGE,
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      createdById: true,
      createdBy: { select: { name: true, email: true } },
    },
  });

  return { requests, total, totalPages, page };
}

export async function getRequestById(user: AuthenticatedUser, id: string) {
  return prisma.request.findFirst({
    where: { id, ...requestVisibilityWhere(user) },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      createdById: true,
      createdBy: { select: { name: true, email: true } },
      history: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fromStatus: true,
          toStatus: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      },
    },
  });
}
