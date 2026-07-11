import bcrypt from "bcryptjs";

import { Role } from "@prisma/client";

import { prisma } from "../config/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@reportaya.pe",
    },

    update: {
      firstName: "Administrador",

      lastName: "ReportaYa",

      role: Role.ADMIN,

      emailVerified: true,
    },

    create: {
      firstName: "Administrador",

      lastName: "ReportaYa",

      email: "admin@reportaya.pe",

      password: passwordHash,

      role: Role.ADMIN,

      emailVerified: true,
    },
  });

  console.log("Administrador creado/asignado correctamente.");

  console.log(`Correo: ${admin.email}`);

  console.log("Contraseña: Admin123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
