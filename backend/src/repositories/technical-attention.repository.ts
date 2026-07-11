import { prisma } from "../config/prisma";

export class TechnicalAttentionRepository {
  async create(data: {
    reportId: string;
    technicianId: string;
    checklist: Record<string, boolean>;
    fieldValues: Record<string, string>;
    actionTaken: string;
    technicalResult: string;
    observations?: string;
  }) {
    return await prisma.technicalAttention.create({
      data: {
        reportId: data.reportId,
        technicianId: data.technicianId,
        checklist: data.checklist,
        fieldValues: data.fieldValues,
        actionTaken: data.actionTaken,
        technicalResult: data.technicalResult,
        observations: data.observations,
      },
    });
  }

  async findByReport(reportId: string) {
    return await prisma.technicalAttention.findMany({
      where: {
        reportId,
      },

      include: {
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findLatestByReport(reportId: string) {
    return await prisma.technicalAttention.findFirst({
      where: {
        reportId,
      },

      include: {
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
