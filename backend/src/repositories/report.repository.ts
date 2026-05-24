import { prisma }
  from "../config/prisma";

import {
  Status,
  ReportCategory,
} from "@prisma/client";

type CreateReportInput = {

  category: ReportCategory;

  problemType: string;

  description: string;

  latitude?: number;

  longitude?: number;

  isAnonymous?: boolean;

  userId: string;

  status: Status;
};

export class ReportRepository {

  async create(
    data: CreateReportInput
  ) {

    return await prisma.report.create({
      data,
    });
  }

  async createEvidences(

    reportId: string,

    imageUrls: string[]
  ) {

    return await prisma
      .reportEvidence
      .createMany({

        data:
          imageUrls.map(
            (imageUrl) => ({

              reportId,

              imageUrl,
            })
          ),
      });
  }



  async findByUser(
    userId: string
  ) {

    return await prisma.report.findMany({
      where: { userId },

      orderBy: {
        createdAt: "desc",
      },
    });

  }

  async findByCategory(
    category: ReportCategory
  ) {

    return await prisma.report.findMany({
      where: { category },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByProblemType(
    problemType: string
  ) {

    return await prisma
      .report
      .findMany({

        where: {
          problemType,
        },

        include: {
          evidences: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });
  }

  async getTopProblems() {

  return await prisma
    .report
    .groupBy({

      by: ["problemType"],

      _count: {
        problemType: true,
      },

      orderBy: {
        _count: {
          problemType: "desc",
        },
      },

      take: 7,
    });
}

  async findById(id: string) {

    return await prisma.report.findUnique({
      where: { id },
    });
  }
}