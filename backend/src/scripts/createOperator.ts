import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";

async function main() {
  const hashedPassword = await bcrypt.hash("Operador123", 10);

  const operator = await prisma.user.create({
    data: {
      email: "operador@municipalidad.com",
      firstName: "Operador",
      lastName: "Municipal",
      password: hashedPassword,
      role: Role.OPERATOR,

      // Importante para que pueda iniciar sesión
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  console.log("Operador creado:", operator.email);
}

main()
  .catch((error) => {
    console.error("Error creando operador:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });