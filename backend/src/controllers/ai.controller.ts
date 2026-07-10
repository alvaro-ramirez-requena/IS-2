import { Request, Response } from "express";
import {
  classifyReport,
  prioritizeReport,
  detectDuplicates,
  detectDelayedReports,
} from "../services/ai.service";
import { prisma } from "../config/prisma";

export class AIController {

  // GET /api/ai/analyze/:reportId
  // Clasificación + priorización + duplicados en un solo llamado
  static async analyzeReport(req: Request, res: Response) {
    try {
      const { reportId } = req.params;

      const report = await prisma.report.findUnique({
        where: { id: reportId },
        select: {
          description: true,
          category: true,
          problemType: true,
        },
      });

      if (!report) {
        return res.status(404).json({ message: "Reporte no encontrado" });
      }

      // Ejecuta las 3 análisis en paralelo
      const [classification, prioritization, duplicates] = await Promise.all([
        classifyReport(report.description, report.category, report.problemType),
        prioritizeReport(report.description, report.category, report.problemType),
        detectDuplicates(reportId),
      ]);

      return res.json({
        classification,
        prioritization,
        duplicates,
      });
    } catch (error: any) {
      console.error("AI analyze error:", error);
      return res.status(500).json({ message: "Error en el análisis de IA" });
    }
  }

  // GET /api/ai/delays
  // Alerta por retrasos
  static async getDelayedReports(req: Request, res: Response) {
    try {
      const result = await detectDelayedReports();
      return res.json(result);
    } catch (error: any) {
      console.error("AI delays error:", error);
      return res.status(500).json({ message: "Error al detectar retrasos" });
    }
  }
}
