import { requestFormSchema, transitionSchema } from "@/validations/request";
import { describe, expect, it } from "vitest";

describe("request form validation", () => {
  it("accepts a valid title and optional blank description", () => {
    expect(
      requestFormSchema.safeParse({ title: "  Accessibility review  ", description: "" }).success,
    ).toBe(true);
  });

  it.each(["", "   "])("rejects a blank title", (title) => {
    expect(requestFormSchema.safeParse({ title, description: "" }).success).toBe(false);
  });

  it("rejects an overly long title", () => {
    expect(requestFormSchema.safeParse({ title: "a".repeat(121), description: "" }).success).toBe(false);
  });

  it("accepts an optional description", () => {
    expect(requestFormSchema.safeParse({ title: "Valid title", description: "Useful context" }).success).toBe(true);
  });

  it("rejects an overly long description", () => {
    expect(requestFormSchema.safeParse({ title: "Valid title", description: "a".repeat(2001) }).success).toBe(false);
  });
});

describe("workflow comment validation", () => {
  const input = { requestId: "request-id", comment: "" };

  it("rejects a rejection without a reason", () => {
    expect(transitionSchema.safeParse({ ...input, action: "REJECT" }).success).toBe(false);
  });

  it("accepts a rejection with a reason", () => {
    expect(transitionSchema.safeParse({ ...input, action: "REJECT", comment: "Missing required information." }).success).toBe(true);
  });

  it.each(["SUBMIT", "START_REVIEW", "APPROVE"] as const)(
    "accepts an optional comment for %s",
    (action) => {
      expect(transitionSchema.safeParse({ ...input, action }).success).toBe(true);
    },
  );

  it("rejects an overly long comment", () => {
    expect(transitionSchema.safeParse({ ...input, action: "SUBMIT", comment: "a".repeat(1001) }).success).toBe(false);
  });
});
