import { RequestStatus, UserRole } from "@/generated/prisma/client";
import { canPerformTransition } from "@/lib/requests/policy";
import type { TransitionAction } from "@/validations/request";
import { describe, expect, it } from "vitest";
import { user } from "./fixtures";

const ownerId = "owner";
const request = (status: RequestStatus, createdById = ownerId) => ({
  status,
  createdById,
});

describe("workflow transition policy", () => {
  it.each([
    [UserRole.USER, RequestStatus.DRAFT, "SUBMIT"],
    [UserRole.REVIEWER, RequestStatus.SUBMITTED, "START_REVIEW"],
    [UserRole.REVIEWER, RequestStatus.IN_REVIEW, "APPROVE"],
    [UserRole.REVIEWER, RequestStatus.IN_REVIEW, "REJECT"],
    [UserRole.ADMIN, RequestStatus.SUBMITTED, "START_REVIEW"],
    [UserRole.ADMIN, RequestStatus.IN_REVIEW, "APPROVE"],
    [UserRole.ADMIN, RequestStatus.IN_REVIEW, "REJECT"],
  ] as const)("allows %s to perform %s from %s", (role, status, action) => {
    expect(
      canPerformTransition(user(role, ownerId), request(status), action),
    ).toBe(true);
  });

  it.each([
    [UserRole.USER, RequestStatus.SUBMITTED, "START_REVIEW"],
    [UserRole.USER, RequestStatus.IN_REVIEW, "APPROVE"],
    [UserRole.USER, RequestStatus.IN_REVIEW, "REJECT"],
    [UserRole.REVIEWER, RequestStatus.DRAFT, "SUBMIT"],
    [UserRole.ADMIN, RequestStatus.DRAFT, "SUBMIT"],
  ] as const)("rejects %s performing %s from %s for another owner", (role, status, action) => {
    expect(
      canPerformTransition(user(role), request(status, "someone-else"), action),
    ).toBe(false);
  });

  it.each([RequestStatus.APPROVED, RequestStatus.REJECTED])(
    "rejects every transition from terminal status %s",
    (status) => {
      const reviewer = user(UserRole.REVIEWER);
      for (const action of ["SUBMIT", "START_REVIEW", "APPROVE", "REJECT"] as TransitionAction[]) {
        expect(canPerformTransition(reviewer, request(status), action)).toBe(false);
      }
    },
  );

  it.each([
    [RequestStatus.SUBMITTED, "SUBMIT"],
    [RequestStatus.IN_REVIEW, "START_REVIEW"],
    [RequestStatus.APPROVED, "APPROVE"],
    [RequestStatus.REJECTED, "REJECT"],
  ] as const)("rejects stale action %s when status is %s", (status, action) => {
    expect(
      canPerformTransition(user(UserRole.ADMIN, ownerId), request(status), action),
    ).toBe(false);
  });
});
