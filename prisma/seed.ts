import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  RequestStatus,
  UserRole,
} from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type DemoHistory = {
  actorEmail: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
  comment?: string;
  createdAt: Date;
};

type DemoRequest = {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  createdByEmail: string;
  createdAt: Date;
  history: DemoHistory[];
};

const timestamp = (day: number, hour: number) =>
  new Date(Date.UTC(2026, 7, day, hour));

async function main() {
  const password = await bcrypt.hash("FlowPilot123!", 12);
  const demoUsers = [
    {
      name: "Admin User",
      email: "admin@flowpilot.dev",
      password,
      role: UserRole.ADMIN,
    },
    {
      name: "Reviewer User",
      email: "reviewer@flowpilot.dev",
      password,
      role: UserRole.REVIEWER,
    },
    {
      name: "Demo User",
      email: "user@flowpilot.dev",
      password,
      role: UserRole.USER,
    },
  ];

  const userIds = new Map<string, string>();
  for (const user of demoUsers) {
    const savedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, password: user.password, role: user.role },
      create: user,
      select: { id: true },
    });
    userIds.set(user.email, savedUser.id);
  }

  const owner = "user@flowpilot.dev";
  const reviewer = "reviewer@flowpilot.dev";
  const admin = "admin@flowpilot.dev";
  const requests: DemoRequest[] = [
    {
      id: "flowpilot-demo-accessibility-review",
      title: "Website Accessibility Review",
      description:
        "Review the customer-facing experience for keyboard navigation, color contrast, and screen-reader usability.",
      status: RequestStatus.APPROVED,
      createdByEmail: owner,
      createdAt: timestamp(18, 13),
      history: [
        { actorEmail: owner, fromStatus: null, toStatus: RequestStatus.DRAFT, createdAt: timestamp(18, 13) },
        { actorEmail: owner, fromStatus: RequestStatus.DRAFT, toStatus: RequestStatus.SUBMITTED, comment: "Ready for accessibility review.", createdAt: timestamp(19, 14) },
        { actorEmail: reviewer, fromStatus: RequestStatus.SUBMITTED, toStatus: RequestStatus.IN_REVIEW, createdAt: timestamp(20, 15) },
        { actorEmail: admin, fromStatus: RequestStatus.IN_REVIEW, toStatus: RequestStatus.APPROVED, comment: "Accessibility checklist completed successfully.", createdAt: timestamp(21, 16) },
      ],
    },
    {
      id: "flowpilot-demo-analytics-integration",
      title: "Third-Party Analytics Integration",
      description:
        "Evaluate a privacy-conscious analytics integration for product usage reporting.",
      status: RequestStatus.IN_REVIEW,
      createdByEmail: owner,
      createdAt: timestamp(22, 13),
      history: [
        { actorEmail: owner, fromStatus: null, toStatus: RequestStatus.DRAFT, createdAt: timestamp(22, 13) },
        { actorEmail: owner, fromStatus: RequestStatus.DRAFT, toStatus: RequestStatus.SUBMITTED, createdAt: timestamp(23, 14) },
        { actorEmail: reviewer, fromStatus: RequestStatus.SUBMITTED, toStatus: RequestStatus.IN_REVIEW, comment: "Reviewing data collection and retention details.", createdAt: timestamp(24, 15) },
      ],
    },
    {
      id: "flowpilot-demo-security-review",
      title: "Security Review for Customer Portal",
      description:
        "Request a security assessment of the new customer portal authentication and account recovery flows.",
      status: RequestStatus.SUBMITTED,
      createdByEmail: owner,
      createdAt: timestamp(25, 13),
      history: [
        { actorEmail: owner, fromStatus: null, toStatus: RequestStatus.DRAFT, createdAt: timestamp(25, 13) },
        { actorEmail: owner, fromStatus: RequestStatus.DRAFT, toStatus: RequestStatus.SUBMITTED, comment: "Architecture notes are ready for review.", createdAt: timestamp(26, 14) },
      ],
    },
    {
      id: "flowpilot-demo-landing-page",
      title: "Marketing Landing Page Approval",
      description:
        "Review the proposed product landing page copy and consent language before publication.",
      status: RequestStatus.REJECTED,
      createdByEmail: owner,
      createdAt: timestamp(27, 13),
      history: [
        { actorEmail: owner, fromStatus: null, toStatus: RequestStatus.DRAFT, createdAt: timestamp(27, 13) },
        { actorEmail: owner, fromStatus: RequestStatus.DRAFT, toStatus: RequestStatus.SUBMITTED, createdAt: timestamp(28, 14) },
        { actorEmail: reviewer, fromStatus: RequestStatus.SUBMITTED, toStatus: RequestStatus.IN_REVIEW, createdAt: timestamp(29, 15) },
        { actorEmail: reviewer, fromStatus: RequestStatus.IN_REVIEW, toStatus: RequestStatus.REJECTED, comment: "Consent language needs clarification before publication.", createdAt: timestamp(30, 16) },
      ],
    },
    {
      id: "flowpilot-demo-api-documentation",
      title: "Internal API Documentation Review",
      description:
        "Review the first draft of the internal API onboarding and troubleshooting guide.",
      status: RequestStatus.DRAFT,
      createdByEmail: owner,
      createdAt: timestamp(31, 13),
      history: [
        { actorEmail: owner, fromStatus: null, toStatus: RequestStatus.DRAFT, createdAt: timestamp(31, 13) },
      ],
    },
  ];

  await prisma.$transaction(async (transaction) => {
    for (const request of requests) {
      const createdById = userIds.get(request.createdByEmail)!;
      const updatedAt = request.history.at(-1)!.createdAt;

      await transaction.request.upsert({
        where: { id: request.id },
        update: {
          title: request.title,
          description: request.description,
          status: request.status,
          createdById,
          createdAt: request.createdAt,
          updatedAt,
        },
        create: {
          id: request.id,
          title: request.title,
          description: request.description,
          status: request.status,
          createdById,
          createdAt: request.createdAt,
          updatedAt,
        },
      });

      await transaction.requestHistory.deleteMany({
        where: { requestId: request.id },
      });
      await transaction.requestHistory.createMany({
        data: request.history.map((history) => ({
          requestId: request.id,
          userId: userIds.get(history.actorEmail)!,
          fromStatus: history.fromStatus,
          toStatus: history.toStatus,
          comment: history.comment,
          createdAt: history.createdAt,
        })),
      });
    }
  });

  console.log(
    `Seed completed: ${demoUsers.length} demo users and ${requests.length} sample requests.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
