import { UserRole } from "@/generated/prisma/client";
import { hasMinimumRole } from "@/lib/auth/roles";
import { describe, expect, it } from "vitest";

describe("authorization hierarchy", () => {
  it.each([
    [UserRole.USER, UserRole.USER, true],
    [UserRole.USER, UserRole.REVIEWER, false],
    [UserRole.USER, UserRole.ADMIN, false],
    [UserRole.REVIEWER, UserRole.USER, true],
    [UserRole.REVIEWER, UserRole.REVIEWER, true],
    [UserRole.REVIEWER, UserRole.ADMIN, false],
    [UserRole.ADMIN, UserRole.USER, true],
    [UserRole.ADMIN, UserRole.REVIEWER, true],
    [UserRole.ADMIN, UserRole.ADMIN, true],
  ])("allows %s access to %s: %s", (role, minimum, expected) => {
    expect(hasMinimumRole(role, minimum)).toBe(expected);
  });
});
