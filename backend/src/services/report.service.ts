import { ReportRepository }
  from "../repositories/report.repository";

import { ReportFactory }
  from "../factories/report.factory";

import {
  ReportCategory,
  Status,
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

  async getReportsByProblemType(
    problemType: string
  ) {

    return await this
      .reportRepository
      .findByProblemType(
        problemType
      );
  }

  async getTopProblems() {

    return await this
      .reportRepository
      .getTopProblems();
  }

  async getReportsByStatus(
    status: Status
  ) {

    return await this
      .reportRepository
      .findByStatus(status);
  }

  async updateReportStatus(
    id: string,
    status: Status
  ) {

    return await this
      .reportRepository
      .updateStatus(
        id,
        status
      );
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

  async getPendingReports() {
    return await this.reportRepository.findPending();
  }
}