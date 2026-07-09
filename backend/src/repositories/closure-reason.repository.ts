import { prisma } from "../config/prisma";

export class ClosureReasonRepository {

  async getAll() {
    return await prisma.closureReason.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async getById(id: string) {
    return await prisma.closureReason.findUnique({
      where: {
        id,
      },
    });
  }

  async getByName(name: string) {
    return await prisma.closureReason.findUnique({
      where: {
        name,
      },
    });
  }

  async create(data: {
    name: string;
    description?: string;
  }) {
    return await prisma.closureReason.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    return await prisma.closureReason.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.closureReason.delete({
      where: {
        id,
      },
    });
  }

}