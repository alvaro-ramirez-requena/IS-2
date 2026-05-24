import { Request, Response } from "express";
import { ReportService } from "../services/report.service";
import { ReportCategory } from "@prisma/client";

const reportService = new ReportService();

export class ReportController {
  static async create(req: Request, res: Response) {
    try {
      const report = await reportService.createReport(req.body);

      res.status(201).json(report);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getByUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;

      const reports = await reportService.getReportsByUser(userId);

      res.json(reports);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getByCategory(req: Request, res: Response) {
    try {
      const category = req.params.category as ReportCategory;

      const reports = await reportService.getReportsByCategory(category);

      res.json(reports);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getByProblemType(
    req: Request,
    res: Response
  ) {

    try {

      const problemType =
        req.params.problemType as string;

      const reports =
        await reportService
          .getReportsByProblemType(
            problemType
          );

      res.json(reports);

    } catch (error: any) {

      res.status(400).json({

        message:
          error.message,
      });
    }
  }

  static async getTopProblems(
    req: Request,
    res: Response
  ) {

    try {

      const topProblems =
        await reportService
          .getTopProblems();

      res.json(topProblems);

    } catch (error: any) {

      res.status(400).json({

        message:
          error.message,
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const report = await reportService.getReportById(id);

      res.json(report);
    } catch (error: any) {
      res.status(404).json({
        message: error.message,
      });
    }
  }
}