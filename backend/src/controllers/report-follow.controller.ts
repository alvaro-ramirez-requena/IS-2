import { Request, Response } from "express";
import { ReportFollowService } from "../services/report-follow.service";

const reportFollowService = new ReportFollowService();

export class ReportFollowController {
  static async follow(req: Request, res: Response) {
    try {
      const { userId, reportId } = req.body;

      const follow = await reportFollowService.followReport(userId, reportId);

      res.status(201).json(follow);
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "No se pudo seguir el reporte",
      });
    }
  }

  static async unfollow(req: Request, res: Response) {
    try {
      const { userId, reportId } = req.body;

      await reportFollowService.unfollowReport(userId, reportId);

      res.json({
        message: "Dejaste de seguir este reporte",
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "No se pudo dejar de seguir el reporte",
      });
    }
  }

  static async isFollowing(req: Request, res: Response) {
    try {
      const userId = String(req.params.userId);

      const reportId = String(req.params.reportId);

      const result = await reportFollowService.isFollowing(userId, reportId);

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "No se pudo verificar el seguimiento",
      });
    }
  }

  static async getFollowedReports(req: Request, res: Response) {
    try {
      const userId = String(req.params.userId);

      const reports = await reportFollowService.getFollowedReports(userId);

      res.json(reports);
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "No se pudieron obtener los reportes seguidos",
      });
    }
  }
}
