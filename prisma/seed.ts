import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
  UserRole,
} from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await bcrypt.hash("FlowPilot123!", 12);

  const users = [
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

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: user,
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });