import { prisma } from "../config/prisma";

export class NotificationRepository {

  async create(data: {
    userId: string;
    reportId?: string;
    title: string;
    message: string;
  }) {

    return await prisma.notification.create({
      data,
    });
  }

  async createMany(
    notifications: {
      userId: string;
      reportId?: string;
      title: string;
      message: string;
    }[]
  ) {

    if (notifications.length === 0) {
      return;
    }

    return await prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    });
  }

  async findByUser(
    userId: string
  ) {

    return await prisma.notification.findMany({
      where: {
        userId,
      },

      include: {
        report: {
          select: {
            id: true,
            userId: true,
            title: true,
            problemType: true,
            status: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async countUnread(
    userId: string
  ) {

    return await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async markAsRead(
    id: string
  ) {

    return await prisma.notification.update({
      where: {
        id,
      },

      data: {
        read: true,
      },
    });
  }

  async markAllAsRead(
    userId: string
  ) {

    return await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },

      data: {
        read: true,
      },
    });
  }
}