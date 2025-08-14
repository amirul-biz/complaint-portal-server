import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password1 = await bcrypt.hash("password123", 10);
  const password2 = await bcrypt.hash("password456", 10);

  await prisma.user.upsert({
    where: { email: "arfankareem1002@gmail.com" },
    update: {},
    create: {
      name: "Arfan Kareem",
      email: "arfankareem1002@gmail.com",
      passwordHash: password1,
    },
  });

  await prisma.user.upsert({
    where: { email: "amirul.irfan.1022000@gmail.com" },
    update: {},
    create: {
      name: "Amirul Irfan",
      email: "amirul.irfan.1022000@gmail.com",
      passwordHash: password2,
    },
  });

  const statuses = ["NEW", "IN_REVIEW", "ESCALATED", "CLOSED"];
  for (const status of statuses) {
    await prisma.status.upsert({
      where: { name: status },
      update: {},
      create: { name: status },
    });
  }

  const priorities = ["LOW", "MEDIUM", "HIGH"];
  for (const priority of priorities) {
    await prisma.priority.upsert({
      where: { name: priority },
      update: {},
      create: { name: priority },
    });
  }

  console.log("Users, Statuses, and Priorities seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
