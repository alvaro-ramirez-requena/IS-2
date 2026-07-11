import {
  Request,
  Response,
} from "express";

import {
  ReportRetentionService,
} from "../services/report-retention.service";

const reportRetentionService =
  new ReportRetentionService();

export class ReportRetentionController {
  static async getConfiguration(
    req: Request,
    res: Response
  ) {
    try {
      const configuration =
        await reportRetentionService.getConfiguration();

      return res.json(configuration);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al obtener la configuración de retención.",
      });
    }
  }

  static async updateConfiguration(
    req: Request,
    res: Response
  ) {
    try {
      const configuration =
        await reportRetentionService.updateConfiguration({
          days:
            req.body.days,
        });

      return res.json(configuration);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al actualizar la configuración de retención.",
      });
    }
  }
}