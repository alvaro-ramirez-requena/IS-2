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

    latitude?: number;

    longitude?: number;

    isAnonymous?: boolean;

    userId: string;

    imageUrls: string[];
  }) {

    const reportData =
  ReportFactory.create(data);

const report =
  await this
    .reportRepository
    .create(reportData);

if (data.imageUrls.length > 0) {

  await this
    .reportRepository
    .createEvidences(

      report.id,

      data.imageUrls
    );
}

return report;
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