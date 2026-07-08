import { ReportRepository }
  from "../repositories/report.repository";

import { ReportFactory }
  from "../factories/report.factory";

import {
  ReportCategory,
  Status,
  Priority,
} from "@prisma/client";

import { GeocodingService }
  from "./geocoding.service";

import { NotificationService } from "./notification.service";
import { ReportFollowRepository } from "../repositories/report-follow.repository";

export class ReportService {

  private reportRepository =
    new ReportRepository();

  private notificationService =
    new NotificationService();

  private reportFollowRepository =
    new ReportFollowRepository();

  private getStatusLabel(
    status: Status
  ) {

    const labels:
      Record<Status, string> = {
        REGISTERED: "Registrado",
        VALIDATING: "En validación",
        APPROVED: "Aprobado",
        REJECTED: "Rechazado",
        PRIORITIZED: "Priorizado",
        ASSIGNED: "Asignado",
        IN_PROGRESS: "En proceso",
        RESOLVED: "Resuelto",
      };

    return labels[status];
  }
  
  async createReport(data: {

    title: string;

    category: ReportCategory;

    problemType: string;

    description: string;

    latitude?: number;

    longitude?: number;

    address?: string;

    isAnonymous?: boolean;

    userId: string;

    imageUrls: string[];
  }) {

    let address:
      string | undefined =
      data.address;

    if (
      !address
      &&
      data.latitude !== undefined
      &&
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
  async getReportsWithLocation() {
    return await this.reportRepository.findReportsWithLocation();
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

  const previousReport =
    await this
      .reportRepository
      .findById(id);

  if (!previousReport) {
    throw new Error(
      "Reporte no encontrado"
    );
  }

  const updatedReport =
    await this
      .reportRepository
      .updateStatus(
        id,
        status
      );

  const followers =
    await this
      .reportFollowRepository
      .findFollowersByReport(id);

  const userIdsToNotify =
    new Set<string>();

  userIdsToNotify.add(
    previousReport.userId
  );

  followers.forEach((follower) => {
    userIdsToNotify.add(
      follower.userId
    );
  });

  const statusText =
    this.getStatusLabel(status);

  const notifications =
    Array
      .from(userIdsToNotify)
      .map((userId) => ({
        userId,

        reportId:
          id,

        title:
          "Cambio de estado en reporte",

        message:
          `El reporte "${previousReport.title || previousReport.problemType}" cambió a ${statusText}.`,
      }));

  await this
    .notificationService
    .createMany(notifications);

  return updatedReport;
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

  async prioritizeReport(id: string, data: {
    impact: "BAJO" | "MEDIO" | "ALTO";
    probability: "BAJO" | "MEDIO" | "ALTO";
    operationalType: string;
    targetDate: string;
    justification: string;
  }) {
    const report = await this.reportRepository.findById(id);

    if (!report) {
      throw new Error("Reporte no encontrado");
    }

    if (report.status !== Status.APPROVED && report.status !== Status.PRIORITIZED) {
      throw new Error("Solo se pueden priorizar reportes aprobados.");
    }

    let computedPriority: Priority = Priority.BAJO;

    if (
      (data.impact === "ALTO" && data.probability === "ALTO") ||
      (data.impact === "ALTO" && data.probability === "MEDIO") ||
      (data.impact === "MEDIO" && data.probability === "ALTO")
    ) {
      computedPriority = Priority.ALTO;
    } else if (
      (data.impact === "MEDIO" && data.probability === "MEDIO") ||
      (data.impact === "ALTO" && data.probability === "BAJO") ||
      (data.impact === "BAJO" && data.probability === "ALTO") ||
      (data.impact === "MEDIO" && data.probability === "BAJO")
    ) {
      computedPriority = Priority.MEDIO;
    }

    const updatedReport = await this.reportRepository.updatePrioritization(id, {
      impact: data.impact,
      probability: data.probability,
      priority: computedPriority,
      operationalType: data.operationalType,
      targetDate: new Date(data.targetDate),
      justification: data.justification,
      status: Status.PRIORITIZED,
    });

    const followers = await this.reportFollowRepository.findFollowersByReport(id);
    const userIdsToNotify = new Set<string>();
    userIdsToNotify.add(report.userId);
    followers.forEach((follower) => userIdsToNotify.add(follower.userId));

    await this.notificationService.createMany(
      Array.from(userIdsToNotify).map((userId) => ({
        userId,
        reportId: id,
        title: "Reporte priorizado",
        message: `El reporte "${report.title || report.problemType}" fue priorizado como ${computedPriority}.`,
      }))
    );

    return updatedReport;
  }

}