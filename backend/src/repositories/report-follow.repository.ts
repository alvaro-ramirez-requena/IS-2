import { prisma } from "../config/prisma";

export class ReportFollowRepository {

  async followReport(
    userId: string,
    reportId: string
  ) {

    return await prisma.reportFollow.upsert({
      where: {
        userId_reportId: {
          userId,
          reportId,
        },
      },

      update: {},

      create: {
        userId,
        reportId,
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
          },
        },
      },
    });
  }

  async unfollowReport(
    userId: string,
    reportId: string
  ) {

    return await prisma.reportFollow.delete({
      where: {
        userId_reportId: {
          userId,
          reportId,
        },
      },
    });
  }

  async isFollowing(
    userId: string,
    reportId: string
  ) {

    const follow =
      await prisma.reportFollow.findUnique({
        where: {
          userId_reportId: {
            userId,
            reportId,
          },
        },
      });

    return Boolean(follow);
  }

  async findFollowedReportsByUser(
    userId: string
  ) {

    return await prisma.reportFollow.findMany({
      where: {
        userId,
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
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findFollowersByReport(
    reportId: string
  ) {

    return await prisma.reportFollow.findMany({
      where: {
        reportId,
      },

      select: {
        userId: true,
      },
    });
  }
}