/// <reference types="node" />
import { PrismaClient } from "../src/generated/prisma";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.district.deleteMany();

  const districts = await Promise.all([
    prisma.district.create({ data: { name: "Miraflores", slug: "miraflores" } }),
    prisma.district.create({ data: { name: "San Isidro", slug: "san-isidro" } }),
    prisma.district.create({ data: { name: "Surco", slug: "surco" } }),
    prisma.district.create({ data: { name: "Lince", slug: "lince" } }),
  ]);

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Acumulación de basura",
        slug: "acumulacion-de-basura",
        group: "AMBIENCE",
        icon: "trash",
      },
    }),
    prisma.category.create({
      data: {
        name: "Mal olor en la vía pública",
        slug: "mal-olor-en-la-via-publica",
        group: "AMBIENCE",
        icon: "smell",
      },
    }),
    prisma.category.create({
      data: {
        name: "Contaminación de áreas verdes",
        slug: "contaminacion-de-areas-verdes",
        group: "AMBIENCE",
        icon: "tree",
      },
    }),
    prisma.category.create({
      data: {
        name: "Alumbrado público defectuoso",
        slug: "alumbrado-publico-defectuoso",
        group: "INFRASTRUCTURE",
        icon: "light",
      },
    }),
    prisma.category.create({
      data: {
        name: "Pistas en mal estado",
        slug: "pistas-en-mal-estado",
        group: "INFRASTRUCTURE",
        icon: "road",
      },
    }),
    prisma.category.create({
      data: {
        name: "Veredas en mal estado",
        slug: "veredas-en-mal-estado",
        group: "INFRASTRUCTURE",
        icon: "walk",
      },
    }),
    prisma.category.create({
      data: {
        name: "Congestión vehicular",
        slug: "congestion-vehicular",
        group: "MOBILITY",
        icon: "car",
      },
    }),
    prisma.category.create({
      data: {
        name: "Estacionamiento en zonas prohibidas",
        slug: "estacionamiento-en-zonas-prohibidas",
        group: "MOBILITY",
        icon: "parking",
      },
    }),
    prisma.category.create({
      data: {
        name: "Ruidos molestos",
        slug: "ruidos-molestos",
        group: "SECURITY",
        icon: "noise",
      },
    }),
    prisma.category.create({
      data: {
        name: "Robos y asaltos",
        slug: "robos-y-asaltos",
        group: "SECURITY",
        icon: "security",
      },
    }),
  ]);

  const miraflores = districts[0];
  const trash = categories[0];
  const light = categories[3];
  const road = categories[4];
  const noise = categories[8];
  const theft = categories[9];

  const citizen = await prisma.user.create({
    data: {
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan@example.com",
      password: await hashPassword("12345678"),
      role: "CITIZEN",
      districtId: miraflores.id,
    },
  });

  const operator = await prisma.user.create({
    data: {
      firstName: "Ana",
      lastName: "Gómez",
      email: "operador@example.com",
      password: await hashPassword("12345678"),
      role: "OPERATOR",
      districtId: miraflores.id,
    },
  });

  await prisma.report.createMany({
    data: [
      {
        userId: citizen.id,
        title: "Basura acumulada",
        description: "Hay acumulación de basura en la esquina.",
        location: "Av. Larco 1234",
        categoryId: trash.id,
        districtId: miraflores.id,
        status: "REGISTERED",
        severity: 3,
        urgency: 2,
      },
      {
        userId: citizen.id,
        title: "Lámpara apagada",
        description: "Lámpara apagada desde hace varios días.",
        location: "Calle Berlín 455",
        categoryId: light.id,
        districtId: miraflores.id,
        status: "VALIDATING",
        severity: 2,
        urgency: 3,
      },
      {
        userId: citizen.id,
        title: "Baches en la pista",
        description: "Baches grandes en la pista principal.",
        location: "Av. Pardo 890",
        categoryId: road.id,
        districtId: miraflores.id,
        status: "APPROVED",
        reviewedById: operator.id,
        reviewedAt: new Date(),
        severity: 4,
        urgency: 4,
      },
      {
        userId: citizen.id,
        title: "Ruidos molestos",
        description: "Música alta durante la noche.",
        location: "Calle Porta 120",
        categoryId: noise.id,
        districtId: miraflores.id,
        status: "APPROVED",
        reviewedById: operator.id,
        reviewedAt: new Date(),
        severity: 2,
        urgency: 2,
      },
      {
        userId: citizen.id,
        title: "Posible robo",
        description: "Persona sospechosa en la cuadra.",
        location: "Parque Kennedy",
        categoryId: theft.id,
        districtId: miraflores.id,
        status: "REJECTED",
        rejectionReason: "Faltan evidencias",
        reviewedById: operator.id,
        reviewedAt: new Date(),
        severity: 5,
        urgency: 5,
      },
    ],
  });

  console.log("Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });