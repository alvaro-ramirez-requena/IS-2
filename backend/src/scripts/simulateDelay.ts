import { prisma } from "../config/prisma";

async function main() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 5);

  await prisma.report.updateMany({
    where: { status: "REGISTERED" },
    data: { updatedAt: threeDaysAgo },
  });

  console.log("Fecha actualizada para simular retraso.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
