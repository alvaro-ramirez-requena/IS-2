import { ReportRepository }
from "../repositories/report.repository";

import { ReportFactory }
from "../factories/report.factory";

import {
  ReportCategory,
} from "@prisma/client";

export class ReportService {

  private reportRepository =
    new ReportRepository();

  async createReport(data: {

    category: ReportCategory;

    problemType: string;

    description: string;

    isAnonymous?: boolean;

    userId: string;
  }) {

    const report =
      ReportFactory.create(data);

    return await this
      .reportRepository
      .create(report);
  }

  async getReportsByUser(
    userId: string
  ) {

    return await this
      .reportRepository
      .findByUser(userId);
  }

  async getReportsByCategory(
    category: ReportCategory
  ) {

    return await this
      .reportRepository
      .findByCategory(category);
  }

  async getReportById(id: string) {

    const report =
      await this
        .reportRepository
        .findById(id);

    if (!report) {

      throw new Error(
        "Reporte no encontrado"
      );
    }

    return report;
  }
}