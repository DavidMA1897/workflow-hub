import "server-only";

import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "./session";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

const roleAccessLevel: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.REVIEWER]: 2,
  [UserRole.ADMIN]: 3,
};

export class AuthorizationError extends Error {
  constructor(message = "You are not authorized to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user || user.role !== session.role) return null;
  return user;
}

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireMinimumRole(minimumRole: UserRole) {
  const user = await getAuthenticatedUser();
  if (!user) throw new AuthorizationError("Authentication required.");
  if (roleAccessLevel[user.role] < roleAccessLevel[minimumRole]) {
    throw new AuthorizationError();
  }
  return user;
}

export const requireUserAccess = () => requireMinimumRole(UserRole.USER);
export const requireReviewerAccess = () =>
  requireMinimumRole(UserRole.REVIEWER);
export const requireAdminAccess = () => requireMinimumRole(UserRole.ADMIN);
