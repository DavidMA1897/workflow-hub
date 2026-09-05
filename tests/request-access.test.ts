import { RequestStatus, UserRole } from "@/generated/prisma/client";
import { canEditRequest, canViewRequest } from "@/lib/requests/access";
import { describe, expect, it } from "vitest";
import { user } from "./fixtures";

const ownerId = "owner";
const ownDraft = { createdById: ownerId, status: RequestStatus.DRAFT };

describe("request access policy", () => {
  const owner = user(UserRole.USER, ownerId);

  it("allows a user to view their own request", () => {
    expect(canViewRequest(owner, ownDraft)).toBe(true);
  });

  it("prevents a user from viewing another user's request", () => {
    expect(canViewRequest(owner, { createdById: "other" })).toBe(false);
  });

  it("allows the creator to edit their own draft", () => {
    expect(canEditRequest(owner, ownDraft)).toBe(true);
  });

  it("prevents the creator from editing a non-draft", () => {
    expect(
      canEditRequest(owner, {
        createdById: ownerId,
        status: RequestStatus.SUBMITTED,
      }),
    ).toBe(false);
  });

  it("prevents editing another user's draft", () => {
    expect(
      canEditRequest(owner, {
        createdById: "other",
        status: RequestStatus.DRAFT,
      }),
    ).toBe(false);
  });

  it.each([UserRole.REVIEWER, UserRole.ADMIN])(
    "allows %s to view globally without granting content editing",
    (role) => {
      const elevatedUser = user(role);
      expect(canViewRequest(elevatedUser, ownDraft)).toBe(true);
      expect(canEditRequest(elevatedUser, ownDraft)).toBe(false);
    },
  );
});
