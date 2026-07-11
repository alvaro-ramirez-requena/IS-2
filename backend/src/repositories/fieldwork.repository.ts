import { EvidencePhase } from "@prisma/client";

import { prisma } from "../config/prisma";

export class FieldWorkRepository {
  async findReportById(reportId: string) {
    return await prisma.report.findUnique({
      where: {
        id: reportId,
      },

      include: {
        assignments: true,
      },
    });
  }

  async findByReport(reportId: string) {
    return await prisma.fieldWork.findUnique({
      where: {
        reportId,
      },

      include: {
        evidences: {
          orderBy: {
            createdAt: "asc",
          },
        },

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

  async start(reportId: string, technicianId: string) {
    const existing = await this.findByReport(reportId);

    if (existing) {
      return existing;
    }

    return await prisma.fieldWork.create({
      data: {
        reportId,
        technicianId,
      },

      include: {
        evidences: true,

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

  async registerArrival(data: {
    reportId: string;
    technicianId: string;
    arrivalLat: number;
    arrivalLng: number;
    distanceMeters?: number;
  }) {
    const fieldWork = await this.start(data.reportId, data.technicianId);

    return await prisma.fieldWork.update({
      where: {
        id: fieldWork.id,
      },

      data: {
        arrivedAt: new Date(),
        arrivalLat: data.arrivalLat,
        arrivalLng: data.arrivalLng,
        distanceMeters: data.distanceMeters,
      },

      include: {
        evidences: true,

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

  async saveNotes(reportId: string, notes: string) {
    return await prisma.fieldWork.update({
      where: {
        reportId,
      },

      data: {
        notes,
      },

      include: {
        evidences: true,

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

  async addEvidence(data: {
    reportId: string;
    technicianId: string;
    imageUrl: string;
    phase: EvidencePhase;
  }) {
    const fieldWork = await this.start(data.reportId, data.technicianId);

    await prisma.fieldWorkEvidence.create({
      data: {
        fieldWorkId: fieldWork.id,
        imageUrl: data.imageUrl,
        phase: data.phase,
      },
    });

    return await this.findByReport(data.reportId);
  }

  async deleteEvidence(evidenceId: string) {
    const evidence = await prisma.fieldWorkEvidence.findUnique({
      where: {
        id: evidenceId,
      },

      include: {
        fieldWork: true,
      },
    });

    if (!evidence) {
      throw new Error("La evidencia no existe.");
    }

    await prisma.fieldWorkEvidence.delete({
      where: {
        id: evidenceId,
      },
    });

    return await this.findByReport(evidence.fieldWork.reportId);
  }

  async close(reportId: string) {
    return await prisma.fieldWork.update({
      where: {
        reportId,
      },

      data: {
        closedAt: new Date(),
      },

      include: {
        evidences: true,

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
