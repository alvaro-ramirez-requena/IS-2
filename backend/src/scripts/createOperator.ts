import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";

async function main() {
  const hashedPassword =
    await bcrypt.hash("Operador123!", 10);

  const operator =
    await prisma.user.upsert({
      where: {
        email: "operador@municipalidad.com",
      },

      update: {
        firstName: "Operador",
        lastName: "Municipal",
        password: hashedPassword,
        role: Role.OPERATOR,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },

      create: {
        email: "operador@municipalidad.com",
        firstName: "Operador",
        lastName: "Municipal",
        password: hashedPassword,
        role: Role.OPERATOR,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

  console.log("Operador listo:", operator.email);
  console.log("Contraseña: Operador123!");
}

main()
  .catch((error) => {
    console.error("Error creando operador:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });