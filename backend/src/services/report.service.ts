import { ReportRepository }
  from "../repositories/report.repository";

import { ReportFactory }
  from "../factories/report.factory";

import {
  ReportCategory,
  Status, Priority
} from "@prisma/client";

import { GeocodingService }
  from "./geocoding.service";

export class ReportService {

  private reportRepository = new ReportRepository();
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
    let address:
      string | undefined;
    if (
      data.latitude !== undefined &&
      data.longitude !== undefined
    ) {
      address =
        await GeocodingService
          .getAddress(
            data.latitude,
            data.longitude
          );
    }

    const reportData =
      ReportFactory.create({
        ...data,
        address,
      });
    const report =
      await this.reportRepository.create(reportData);
    if (data.imageUrls.length > 0) {
      await this.reportRepository.createEvidences(
          report.id,
          data.imageUrls
        );
    }
    return report;
  }
  async getReportsByUser(
    userId: string
  ) {
    return await this.reportRepository.findByUser(userId);
  }

  async getReportsByCategory(
    category: ReportCategory
  ) {
    return await this.reportRepository.findByCategory(category);
  }

  async getReportsByProblemType(
    problemType: string
  ) {return await this.reportRepository.findByProblemType(
        problemType
      );
  }

  async getTopProblems() {
    return await this.reportRepository.getTopProblems();
  }

  async getReportsByStatus(
    status: Status
  ) {

    return await this.reportRepository.findByStatus(status);
  }

  async updateReportStatus(
    id: string,
    status: Status
  ) {

    return await this.reportRepository.updateStatus(
        id,
        status
      );
  }

  async getReportById(id: string) {
    const report =
      await this.reportRepository.findById(id);
    if (!report) {
      throw new Error(
        "Reporte no encontrado"
      );
    }
    return report;
  }
async prioritizeReport(id: string, data: {
  impact: "BAJO" | "MEDIO" | "ALTO";
  probability: "BAJO" | "MEDIO" | "ALTO";
  operationalType: string;
  targetDate: string;
  justification: string;
}) {
  let computedPriority: Priority = Priority.BAJO;
  if (
    (data.impact === "ALTO" && data.probability === "ALTO") ||
    (data.impact === "ALTO" && data.probability === "MEDIO") ||
    (data.impact === "MEDIO" && data.probability === "ALTO")
  ) {
    computedPriority = Priority.ALTO;
  } 
  else if (
    (data.impact === "MEDIO" && data.probability === "MEDIO") ||
    (data.impact === "ALTO" && data.probability === "BAJO") ||
    (data.impact === "BAJO" && data.probability === "ALTO") ||
    (data.impact === "MEDIO" && data.probability === "BAJO")
  ) {
    computedPriority = Priority.MEDIO;
  } 
  else {
    computedPriority = Priority.BAJO;
  }
  return await this.reportRepository.updatePrioritization(id, {
    impact: data.impact,
    probability: data.probability,
    priority: computedPriority,
    operationalType: data.operationalType,
    targetDate: new Date(data.targetDate),
    justification: data.justification,
    status: Status.PRIORITIZED
  });
}
}