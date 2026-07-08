import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {

  private notificationRepository =
    new NotificationRepository();

  async createNotification(data: {
    userId: string;
    reportId?: string;
    title: string;
    message: string;
  }) {

    return await this
      .notificationRepository
      .create(data);
  }

  async createMany(
    notifications: {
      userId: string;
      reportId?: string;
      title: string;
      message: string;
    }[]
  ) {

    return await this
      .notificationRepository
      .createMany(notifications);
  }

  async getByUser(
    userId: string
  ) {

    const notifications =
      await this
        .notificationRepository
        .findByUser(userId);

    const unreadCount =
      await this
        .notificationRepository
        .countUnread(userId);

    return {
      unreadCount,
      notifications,
    };
  }

  async markAsRead(
    id: string
  ) {

    return await this
      .notificationRepository
      .markAsRead(id);
  }

  async markAllAsRead(
    userId: string
  ) {

    return await this
      .notificationRepository
      .markAllAsRead(userId);
  }
}