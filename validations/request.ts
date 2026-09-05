import { RequestStatus } from "@/generated/prisma/client";
import { z } from "zod";

export const requestFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(2_000, "Description must be 2,000 characters or fewer."),
});

export const requestQuerySchema = z.object({
  q: z.string().trim().max(100).catch("").default(""),
  status: z.enum(RequestStatus).optional().catch(undefined),
  page: z.coerce.number().int().positive().catch(1).default(1),
});

export const transitionActions = [
  "SUBMIT",
  "START_REVIEW",
  "APPROVE",
  "REJECT",
] as const;

export type TransitionAction = (typeof transitionActions)[number];

export const requestIdSchema = z.string().trim().min(1).max(64);

export const transitionSchema = z
  .object({
    requestId: requestIdSchema,
    action: z.enum(transitionActions),
    comment: z
      .string()
      .trim()
      .max(1_000, "Comment must be 1,000 characters or fewer."),
  })
  .superRefine((value, context) => {
    if (value.action === "REJECT" && !value.comment) {
      context.addIssue({
        code: "custom",
        path: ["comment"],
        message: "A rejection reason is required.",
      });
    }
  });

export type RequestFormInput = z.infer<typeof requestFormSchema>;
export type RequestQuery = z.infer<typeof requestQuerySchema>;
