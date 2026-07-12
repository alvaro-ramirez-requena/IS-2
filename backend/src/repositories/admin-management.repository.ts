import {
  Role,
} from "@prisma/client";

import {
  prisma,
} from "../config/prisma";

export class AdminManagementRepository {
  async findMunicipalities() {
    return await prisma.municipality.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findMunicipalityById(
    id: string
  ) {
    return await prisma.municipality.findUnique({
      where: {
        id,
      },
    });
  }

  async findMunicipalityByName(
    name: string
  ) {
    return await prisma.municipality.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async createMunicipality(data: {
    name: string;
    district?: string;
    province?: string;
    department?: string;
    aliases?: string[];
  }) {
    return await prisma.municipality.create({
      data: {
        name:
          data.name,

        district:
          data.district,

        province:
          data.province,

        department:
          data.department,

        aliases:
          data.aliases || [],
      },
    });
  }

  async findUserByEmail(
    email: string
  ) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOperators() {
    return await prisma.user.findMany({
      where: {
        role:
          Role.OPERATOR,
      },

      select: {
        id:
          true,

        firstName:
          true,

        lastName:
          true,

        email:
          true,

        role:
          true,

        emailVerified:
          true,

        municipalityId:
          true,

        municipality:
          true,

        createdAt:
          true,
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });
  }

  async createOperator(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    municipalityId: string;
  }) {
    return await prisma.user.create({
      data: {
        firstName:
          data.firstName,

        lastName:
          data.lastName,

        email:
          data.email,

        password:
          data.password,

        role:
          Role.OPERATOR,

        municipalityId:
          data.municipalityId,

        emailVerified:
          true,
      },

      select: {
        id:
          true,

        firstName:
          true,

        lastName:
          true,

        email:
          true,

        role:
          true,

        emailVerified:
          true,

        municipalityId:
          true,

        municipality:
          true,

        createdAt:
          true,
      },
    });
  }
}