import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const callao = await prisma.municipality.upsert({
    where: { name: "Municipalidad Provincial del Callao" },
    update: {},
    create: {
      name: "Municipalidad Provincial del Callao",
      district: "Callao",
      province: "Callao",
      department: "Callao",
    },
  });

  const surco = await prisma.municipality.upsert({
    where: { name: "Municipalidad de Santiago de Surco" },
    update: {},
    create: {
      name: "Municipalidad de Santiago de Surco",
      district: "Santiago de Surco",
      province: "Lima",
      department: "Lima",
    },
  });

  const miraflores = await prisma.municipality.upsert({
    where: { name: "Municipalidad de Miraflores" },
    update: {},
    create: {
      name: "Municipalidad de Miraflores",
      district: "Miraflores",
      province: "Lima",
      department: "Lima",
    },
  });

  const sanIsidro = await prisma.municipality.upsert({
    where: { name: "Municipalidad de San Isidro" },
    update: {},
    create: {
      name: "Municipalidad de San Isidro",
      district: "San Isidro",
      province: "Lima",
      department: "Lima",
    },
  });

  // Nuevo - Villa El Salvador
  const villaElSalvador = await prisma.municipality.upsert({
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
    where: { email: "operador.callao@test.com" },
    update: { role: "OPERATOR", emailVerified: true, municipalityId: callao.id },
    create: {
      email: "operador.callao@test.com",
      firstName: "Operador",
      lastName: "Callao",
      password,
      role: "OPERATOR",
      emailVerified: true,
      municipalityId: callao.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "operador.surco@test.com" },
    update: { role: "OPERATOR", emailVerified: true, municipalityId: surco.id },
    create: {
      email: "operador.surco@test.com",
      firstName: "Operador",
      lastName: "Surco",
      password,
      role: "OPERATOR",
      emailVerified: true,
      municipalityId: surco.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "operador.miraflores@test.com" },
    update: { role: "OPERATOR", emailVerified: true, municipalityId: miraflores.id },
    create: {
      email: "operador.miraflores@test.com",
      firstName: "Operador",
      lastName: "Miraflores",
      password,
      role: "OPERATOR",
      emailVerified: true,
      municipalityId: miraflores.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "operador.sanisidro@test.com" },
    update: { role: "OPERATOR", emailVerified: true, municipalityId: sanIsidro.id },
    create: {
      email: "operador.sanisidro@test.com",
      firstName: "Operador",
      lastName: "San Isidro",
      password,
      role: "OPERATOR",
      emailVerified: true,
      municipalityId: sanIsidro.id,
    },
  });

  // Nuevo - Villa El Salvador
  await prisma.user.upsert({
    where: { email: "operador.ves@test.com" },
    update: { role: "OPERATOR", emailVerified: true, municipalityId: villaElSalvador.id },
    create: {
      email: "operador.ves@test.com",
      firstName: "Operador",
      lastName: "Villa El Salvador",
      password,
      role: "OPERATOR",
      emailVerified: true,
      municipalityId: villaElSalvador.id,
    },
  });

  console.log("Municipalidades y operadores creados correctamente.");
  console.log("Contraseña de todos los operadores: 123456");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });