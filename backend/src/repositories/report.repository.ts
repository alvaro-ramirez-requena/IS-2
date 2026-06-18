import { prisma }
  from "../config/prisma";

import {
  Status,
  ReportCategory,
  Priority
} from "@prisma/client";

type CreateReportInput = {
  category: ReportCategory;
  problemType: string;
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
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
      include: {
        evidences: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },

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
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
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

  async findByStatus(
    status: Status
  ) {
    return await prisma
      .report
      .findMany({
        where: {
          status,
        },
        include: {
          evidences: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  }
  async updateStatus(
    id: string,
    status: Status
  ) {

    return await prisma
      .report
      .update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
  }

  async findById(id: string) {
    return await prisma
      .report
      .findUnique({
        where: { id },
        include: {
          evidences: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
  }
  async updatePrioritization(id: string, data: {
    impact: string;
    probability: string;
    priority: Priority;
    operationalType: string;
    targetDate: Date;
    justification: string;
    status: Status;
  }) {
    return await prisma.report.update({
      where: { id },
      data: {
        impact: data.impact,
        probability: data.probability,
        priority: data.priority,
        operationalType: data.operationalType,
        targetDate: data.targetDate,
        justification: data.justification,
        status: data.status,
      },
    });
  }
}