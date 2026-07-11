import { Status } from "@prisma/client";

import { prisma } from "../config/prisma";

type CreateTechnicalClosureInput = {
  reportId: string;
  technicianId: string;
  result: string;
  closureReasonId?: string;
  observations: string;
  closureEvidenceUrl?: string;
  followUpRequired?: boolean;
  followUpNotes?: string;
};

export class TechnicalClosureRepository {
  async findClosureReasonById(closureReasonId: string) {
    return await prisma.closureReason.findUnique({
      where: {
        id: closureReasonId,
      },
    });
  }

  async create(data: CreateTechnicalClosureInput) {
    return await prisma.$transaction(async (tx) => {
      const closure = await tx.technicalClosure.create({
        data: {
          reportId: data.reportId,

          technicianId: data.technicianId,

          result: data.result,

          closureReasonId: data.closureReasonId,

          observations: data.observations,

          closureEvidenceUrl: data.closureEvidenceUrl,

          followUpRequired: data.followUpRequired ?? false,

          followUpNotes: data.followUpNotes,
        },

        include: {
          closureReason: true,

          technician: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      const resolvedReport = await tx.report.update({
        where: {
          id: data.reportId,
        },

        data: {
          status: Status.RESOLVED,

          resolvedAt: new Date(),
        },
      });

      const otherActiveAssignments = await tx.reportAssignment.count({
        where: {
          technicianId: data.technicianId,

          reportId: {
            not: data.reportId,
          },

          active: true,

          report: {
            status: {
              in: [Status.ASSIGNED, Status.IN_TRANSIT, Status.IN_PROGRESS],
            },
          },
        },
      });

      if (otherActiveAssignments === 0) {
        await tx.technicianProfile.updateMany({
          where: {
            userId: data.technicianId,
          },

          data: {
            available: true,
          },
        });
      }

      const followers = await tx.reportFollow.findMany({
        where: {
          reportId: resolvedReport.id,
        },
      });

      const userIdsToNotify = Array.from(
        new Set([resolvedReport.userId, ...followers.map((follow) => follow.userId)])
      );

      await tx.notification.createMany({
        data: userIdsToNotify.map((userId) => ({
          userId,

          reportId: resolvedReport.id,

          title: "Reporte resuelto",

          message: `El reporte "${resolvedReport.title}" fue marcado como resuelto por el técnico.`,
        })),
      });

      return closure;
    });
  }

  async findByReportId(reportId: string) {
    return await prisma.technicalClosure.findUnique({
      where: {
        reportId,
      },

      include: {
        closureReason: true,

        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }
}
