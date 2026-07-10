import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

const notificationService =
  new NotificationService();

export class NotificationController {

  static async getByUser(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        String(req.params.userId);

      const result =
        await notificationService
          .getByUser(userId);

      res.json(result);

    } catch (error: any) {

      res.status(400).json({
        message:
          error.message || "No se pudieron obtener las notificaciones",
      });
    }
  }

  static async markAsRead(
    req: Request,
    res: Response
  ) {

    try {

      const id =
        String(req.params.id);

      const notification =
        await notificationService
          .markAsRead(id);

      res.json(notification);

    } catch (error: any) {

      res.status(400).json({
        message:
          error.message || "No se pudo marcar la notificación como leída",
      });
    }
  }

  static async markAllAsRead(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        String(req.params.userId);

      await notificationService
        .markAllAsRead(userId);

      res.json({
        message:
          "Notificaciones marcadas como leídas",
      });

    } catch (error: any) {

      res.status(400).json({
        message:
          error.message || "No se pudieron marcar las notificaciones",
      });
    }
  }
}