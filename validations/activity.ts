import { RequestStatus } from "@/generated/prisma/client";
import { z } from "zod";

export const activityFilters = [
  "CREATED",
  RequestStatus.SUBMITTED,
  RequestStatus.IN_REVIEW,
  RequestStatus.APPROVED,
  RequestStatus.REJECTED,
] as const;

export type ActivityFilter = (typeof activityFilters)[number];

export const activityQuerySchema = z.object({
  q: z.string().trim().max(100).catch("").default(""),
  status: z.enum(activityFilters).optional().catch(undefined),
  page: z.coerce.number().int().positive().catch(1).default(1),
});

export type ActivityQuery = z.infer<typeof activityQuerySchema>;
