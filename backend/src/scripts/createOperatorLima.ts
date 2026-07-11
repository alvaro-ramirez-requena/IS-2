import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const lima = await prisma.municipality.upsert({
    where: { name: "Municipalidad de Villa El Salvador" },
    update: {},
    create: {
      name: "Municipalidad de Villa El Salvador",
      district: "Villa El Salvador",
      province: "Lima",
      department: "Lima",
    },
  });

  await prisma.user.upsert({
    where: { email: "operador.ves@test.com" },
    update: { role: "OPERATOR", emailVerified: true, municipalityId: lima.id },
    create: {
      email: "operador.ves@test.com",
      firstName: "Operador",
      lastName: "Villa El Salvador",
      password,
      role: "OPERATOR",
      emailVerified: true,
      municipalityId: lima.id,
    },
  });

  console.log("Operador creado: operador.ves@test.com / 123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
