import { prisma } from "../config/prisma";

async function main() {
  // Categorías
  const infrastructure =
    await prisma.category.create({
      data: {
        name: "Infraestructura",
        description:
          "Problemas relacionados con infraestructura urbana",
      },
    });

  const security =
    await prisma.category.create({
      data: {
        name: "Seguridad",
        description:
          "Problemas relacionados con seguridad ciudadana",
      },
    });

  const environment =
    await prisma.category.create({
      data: {
        name: "Medio Ambiente",
        description:
          "Problemas relacionados con el medio ambiente",
      },
    });

  const mobility =
    await prisma.category.create({
      data: {
        name: "Movilidad",
        description:
          "Problemas relacionados con tránsito y transporte",
      },
    });

  // Tipos de problema
  await prisma.problemType.createMany({
    data: [
      {
        name: "Pistas",
        categoryId: infrastructure.id,
      },
      {
        name: "Veredas",
        categoryId: infrastructure.id,
      },
      {
        name: "Alumbrado Público",
        categoryId: infrastructure.id,
      },
      {
        name: "Robo",
        categoryId: security.id,
      },
      {
        name: "Vandalismo",
        categoryId: security.id,
      },
      {
        name: "Basura",
        categoryId: environment.id,
      },
      {
        name: "Áreas Verdes",
        categoryId: environment.id,
      },
      {
        name: "Congestión Vehicular",
        categoryId: mobility.id,
      },
    ],
  });

  // Motivos de cierre
  await prisma.closureReason.createMany({
    data: [
      {
        name: "Resuelto",
      },
      {
        name: "Mitigación temporal",
      },
      {
        name: "Duplicado",
      },
      {
        name: "Fuera de competencia",
      },
      {
        name: "Seguimiento requerido",
      },
    ],
  });

  // SLA
  await prisma.slaConfiguration.createMany({
    data: [
      {
        priority: "BAJO",
        responseHours: 72,
      },
      {
        priority: "MEDIO",
        responseHours: 48,
      },
      {
        priority: "ALTO",
        responseHours: 24,
      },
    ],
  });

  console.log(
    "Catálogos operativos creados correctamente"
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });