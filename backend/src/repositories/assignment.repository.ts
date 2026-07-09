import { prisma } from "../config/prisma";

export class AssignmentRepository {

  async getTechnicians(filters?: {
    municipalityId?: string;
    specialty?: string;
    availability?: boolean;
  }) {
    return await prisma.user.findMany({
      where: {
        role: "TECHNICIAN",

        technicianProfile: {
          is: {
            municipalityId:
              filters?.municipalityId || undefined,

            available:
              filters?.availability,

            skills:
              filters?.specialty
                ? {
                    has: filters.specialty,
                  }
                : undefined,
          },
        },
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,

        technicianProfile: {
          select: {
            id: true,
            userId: true,
            municipalityId: true,
            skills: true,
            available: true,
            crewName: true,

            municipality: {
              select: {
                id: true,
                name: true,
                district: true,
                province: true,
                department: true,
              },
            },
          },
        },
      },

      orderBy: {
        firstName: "asc",
      },
    });
  }

  async assignReport(
    reportId: string,
    technicianId: string,
    assignedById: string,
    notes?: string
  ) {
    return await prisma.reportAssignment.create({
      data: {
        reportId,
        technicianId,
        assignedById,
        notes,
      },
    });
  }

  async getAssignmentsByReport(
    reportId: string
  ) {
    return await prisma
      .reportAssignment
      .findMany({
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

              technicianProfile: {
                select: {
                  id: true,
                  userId: true,
                  municipalityId: true,
                  skills: true,
                  available: true,
                  crewName: true,

                  municipality: {
                    select: {
                      id: true,
                      name: true,
                      district: true,
                      province: true,
                      department: true,
                    },
                  },
                },
              },
            },
          },

          assignedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },

        orderBy: {
          assignedAt: "desc",
        },
      });
  }

  async getActiveAssignment(
    reportId: string
  ) {
    return await prisma
      .reportAssignment
      .findFirst({
        where: {
          reportId,
          active: true,
        },
      });
  }

  async deactivateAssignment(
    assignmentId: string
  ) {
    return await prisma
      .reportAssignment
      .update({
        where: {
          id: assignmentId,
        },

        data: {
          active: false,
        },
      });
  }

  async getAssignmentsByTechnician(
    technicianId: string
  ) {
    return await prisma
      .reportAssignment
      .findMany({
        where: {
          technicianId,
          active: true,
        },

        include: {
          report: {
            include: {
              evidences: true,

              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },

              municipality: true,
            },
          },

          assignedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },

        orderBy: {
          assignedAt: "desc",
        },
      });
  }
}