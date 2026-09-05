import { UserRole } from "@/generated/prisma/client";

const roleAccessLevel: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.REVIEWER]: 2,
  [UserRole.ADMIN]: 3,
};

export function hasMinimumRole(role: UserRole, minimumRole: UserRole) {
  return roleAccessLevel[role] >= roleAccessLevel[minimumRole];
}
