import { prisma } from "../config/prisma";

async function main() {
  await prisma.report.update({
    where: { id: "f920412e-7d8c-4b1d-a237-78d44672d15d" },
    data: { municipalityId: "50c5b498-229e-4f0e-a021-e1bc8ce24617" },
  });
  console.log("Municipalidad asignada correctamente.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());