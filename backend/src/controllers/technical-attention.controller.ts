import { Request, Response } from "express";
import { TechnicalAttentionService } from "../services/technical-attention.service";

const technicalAttentionService = new TechnicalAttentionService();

export class TechnicalAttentionController {
  static async create(req: Request, res: Response) {
    try {
      const attention = await technicalAttentionService.createAttention({
        reportId: req.body.reportId,
        technicianId: req.body.technicianId,
        checklist: req.body.checklist || {},
        fieldValues: req.body.fieldValues || {},
        actionTaken: req.body.actionTaken,
        technicalResult: req.body.technicalResult,
        observations: req.body.observations,
      });

      return res.status(201).json(attention);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Error al registrar la atención técnica.",
      });
    }
  }

  static async getByReport(req: Request, res: Response) {
    try {
      const reportId = req.params.reportId as string;

      const attentions = await technicalAttentionService.getByReport(reportId);

      return res.json(attentions);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Error al obtener atenciones técnicas.",
      });
    }
  }

  static async getLatestByReport(req: Request, res: Response) {
    try {
      const reportId = req.params.reportId as string;

      const attention = await technicalAttentionService.getLatestByReport(reportId);

      return res.json(attention);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Error al obtener la atención técnica.",
      });
    }
  }
}
