import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";

async function main() {
  const hashedPassword = await bcrypt.hash(
    "Tecnico123",
    10
  );

  const technician = await prisma.user.upsert({
    where: {
      email: "tecnico@municipalidad.com",
    },
    update: {
      firstName: "Juan",
      lastName: "Tecnico",
      password: hashedPassword,
      role: "TECHNICIAN",
    },
    create: {
      email: "tecnico@municipalidad.com",
      firstName: "Juan",
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
      district: "Norte",
      skills: ["Infraestructura"],
      available: true,
      crewName: "Cuadrilla Norte",
    },
    create: {
      userId: technician.id,
      district: "Norte",
      skills: ["Infraestructura"],
      available: true,
      crewName: "Cuadrilla Norte",
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
