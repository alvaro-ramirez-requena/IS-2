import { prisma } from "../config/prisma";

export class MunicipalityRepository {
  async findByName(name: string) {
    return await prisma.municipality.findUnique({
      where: {
        name,
      },
    });
  }

  async findOrCreateByName(name: string) {
    const existingMunicipality =
      await this.findByName(name);

    if (existingMunicipality) {
      return existingMunicipality;
    }

    return await prisma.municipality.create({
      data: {
        name,
      },
    });
  }

  async findAll() {
    return await prisma.municipality.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }
}