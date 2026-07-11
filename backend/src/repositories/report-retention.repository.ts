import {
  prisma,
} from "../config/prisma";

export class ReportRetentionRepository {
  async findCurrent() {
    return await prisma.reportRetentionConfiguration.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async createDefault() {
    return await prisma.reportRetentionConfiguration.create({
      data: {
        days: 30,
      },
    });
  }

  async update(
    id: string,
    days: number
  ) {
    return await prisma.reportRetentionConfiguration.update({
      where: {
        id,
      },

      data: {
        days,
      },
    });
  }

  async getOrCreate() {
    const currentConfiguration =
      await this.findCurrent();

    if (currentConfiguration) {
      return currentConfiguration;
    }

    return await this.createDefault();
  }
}