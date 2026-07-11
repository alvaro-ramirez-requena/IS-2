import {
  prisma,
} from "../config/prisma";

const skills = [
  {
    name: "Mantenimiento de pistas y baches",
    description: "Atención de baches, pistas dañadas y deterioro vial.",
  },
  {
    name: "Mantenimiento de veredas",
    description: "Atención de veredas rotas, hundidas o peligrosas.",
  },
  {
    name: "Alumbrado público",
    description: "Revisión de luminarias, postes y fallas de iluminación.",
  },
  {
    name: "Semáforos y señalización",
    description: "Atención de semáforos, señales y elementos de tránsito.",
  },
  {
    name: "Recojo de residuos",
    description: "Gestión de acumulación de basura y residuos sólidos.",
  },
  {
    name: "Limpieza y saneamiento urbano",
    description: "Limpieza de espacios públicos y atención de focos insalubres.",
  },
  {
    name: "Áreas verdes y contaminación",
    description: "Atención de parques, jardines y problemas ambientales.",
  },
  {
    name: "Control de comercio informal",
    description: "Apoyo en incidencias relacionadas con comercio no autorizado.",
  },
  {
    name: "Apoyo en seguridad ciudadana",
    description: "Apoyo operativo en incidencias de seguridad ciudadana.",
  },
  {
    name: "Control de ruidos y convivencia",
    description: "Atención de reportes por ruidos molestos y convivencia vecinal.",
  },
  {
    name: "Gestión de tránsito y movilidad",
    description: "Atención de incidencias de tránsito, movilidad y congestión.",
  },
  {
    name: "Retiro de vehículos abandonados",
    description: "Gestión de reportes sobre vehículos abandonados en vía pública.",
  },
];

async function main() {
  for (const skill of skills) {
    await prisma.technicianSkill.upsert({
      where: {
        name:
          skill.name,
      },

      update: {
        description:
          skill.description,

        active:
          true,
      },

      create: {
        name:
          skill.name,

        description:
          skill.description,

        active:
          true,
      },
    });
  }

  console.log(
    "Habilidades técnicas cargadas correctamente."
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