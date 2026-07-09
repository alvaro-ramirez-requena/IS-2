import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";

async function main() {
  const hashedPassword = await bcrypt.hash(
    "Tecnico123",
    10
  );

  const technician = await prisma.user.upsert({
    where: {
      email: "pedro@municipalidad.com",
    },
    update: {
      firstName: "Pedro",
      lastName: "Tecnico",
      password: hashedPassword,
      role: "TECHNICIAN",
    },
    create: {
      email: "pedro@municipalidad.com",
      firstName: "Pedro",
      lastName: "Tecnico",
      password: hashedPassword,
      role: "TECHNICIAN",
      emailVerified: true,
    },
  });

  await prisma.technicianProfile.upsert({
    where: {
      userId: technician.id,
    },
    update: {
      district: "Sur",
      skills: ["Seguridad"],
      available: true,
      crewName: "Cuadrilla Sur",
    },
    create: {
      userId: technician.id,
      district: "Sur",
      skills: ["Seguridad"],
      available: true,
      crewName: "Cuadrilla Sur",
    },
  });

  console.log(
    "Técnico listo:",
    technician.email
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
