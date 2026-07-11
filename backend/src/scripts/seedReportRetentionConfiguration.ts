import {
  prisma,
} from "../config/prisma";

async function main() {
  const existingConfiguration =
    await prisma.reportRetentionConfiguration.findFirst();

  if (existingConfiguration) {
    await prisma.reportRetentionConfiguration.update({
      where: {
        id:
          existingConfiguration.id,
      },

      data: {
        days:
          existingConfiguration.days || 30,
      },
    });

    console.log(
      `Configuración de retención existente: ${existingConfiguration.days} días.`
    );

    return;
  }

  await prisma.reportRetentionConfiguration.create({
    data: {
      days:
        30,
    },
  });

  console.log(
    "Configuración de retención creada con 30 días."
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