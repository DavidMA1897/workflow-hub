import { RequestStatus } from "@/generated/prisma/client";
import { getActivityActorText, getActivityLabel } from "@/lib/activity/presentation";
import { describe, expect, it } from "vitest";

describe("activity presentation", () => {
  it("describes initial history as request creation", () => {
    const event = { fromStatus: null, toStatus: RequestStatus.DRAFT };
    expect(getActivityLabel(event)).toBe("Request created");
    expect(getActivityActorText("Demo User", event)).toBe("Demo User created this request");
  });

  it.each([
    [RequestStatus.DRAFT, RequestStatus.SUBMITTED, "Submitted for review"],
    [RequestStatus.SUBMITTED, RequestStatus.IN_REVIEW, "Review started"],
    [RequestStatus.IN_REVIEW, RequestStatus.APPROVED, "Request approved"],
    [RequestStatus.IN_REVIEW, RequestStatus.REJECTED, "Request rejected"],
  ])("formats %s to %s", (fromStatus, toStatus, label) => {
    expect(getActivityLabel({ fromStatus, toStatus })).toBe(label);
  });
});
