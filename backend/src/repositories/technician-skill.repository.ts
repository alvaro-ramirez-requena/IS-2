import {
  prisma,
} from "../config/prisma";

export class TechnicianSkillRepository {
  async findAll() {
    return await prisma.technicianSkill.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findActive() {
    return await prisma.technicianSkill.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(
    id: string
  ) {
    return await prisma.technicianSkill.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(
    name: string
  ) {
    return await prisma.technicianSkill.findUnique({
      where: {
        name,
      },
    });
  }

  async create(data: {
    name: string;
    description?: string;
  }) {
    return await prisma.technicianSkill.create({
      data: {
        name: data.name,
        description: data.description,
        active: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string | null;
      active?: boolean;
    }
  ) {
    return await prisma.technicianSkill.update({
      where: {
        id,
      },
      data,
    });
  }

  async activate(
    id: string
  ) {
    return await prisma.technicianSkill.update({
      where: {
        id,
      },
      data: {
        active: true,
      },
    });
  }

  async deactivate(
    id: string
  ) {
    return await prisma.technicianSkill.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  }
}