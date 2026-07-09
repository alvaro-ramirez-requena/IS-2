import { prisma } from "../config/prisma";
import { Priority } from "@prisma/client";

export class SlaConfigurationRepository {

  async getAll() {
    return await prisma.slaConfiguration.findMany({
      orderBy: {
        responseHours: "asc",
      },
    });
  }

  async getById(id: string) {
    return await prisma.slaConfiguration.findUnique({
      where: {
        id,
      },
    });
  }

  async getByPriority(priority: Priority) {
    return await prisma.slaConfiguration.findUnique({
      where: {
        priority,
      },
    });
  }

  async update(
    id: string,
    data: {
      responseHours: number;
    }
  ) {
    return await prisma.slaConfiguration.update({
      where: {
        id,
      },
      data,
    });
  }

}