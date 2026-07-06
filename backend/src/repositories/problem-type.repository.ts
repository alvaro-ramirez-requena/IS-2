import { prisma } from "../config/prisma";

export class ProblemTypeRepository {

  async getAll() {
    return await prisma.problemType.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async getById(id: string) {
    return await prisma.problemType.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  async getByNameAndCategory(
    name: string,
    categoryId: string
  ) {
    return await prisma.problemType.findFirst({
      where: {
        name,
        categoryId,
      },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    categoryId: string;
  }) {
    return await prisma.problemType.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      categoryId?: string;
    }
  ) {
    return await prisma.problemType.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.problemType.delete({
      where: {
        id,
      },
    });
  }
}