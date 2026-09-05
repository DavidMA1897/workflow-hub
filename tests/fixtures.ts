import { UserRole } from "@/generated/prisma/client";
import type { AuthenticatedUser } from "@/lib/auth/authorization";

export function user(
  role: UserRole,
  id = role.toLowerCase(),
): AuthenticatedUser {
  return {
    id,
    role,
    name: `${role} User`,
    email: `${id}@flowpilot.test`,
  };
}
