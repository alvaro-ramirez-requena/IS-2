import { ReportRepository } from "../repositories/report.repository";
import { ReportFactory } from "../factories/report.factory";

export class ReportService {
  private reportRepository = new ReportRepository();

  async createReport(data: {
    title: string;
    description: string;
    location: string;
    userId: string;
  }) {
    // crear objeto con factory
    const report = ReportFactory.create(data);

    // guardar en BD
    return await this.reportRepository.create(report);
  }

  async getReportsByUser(userId: string) {
    return await this.reportRepository.findByUser(userId);
  }

  async getReportById(id: string) {
    const report = await this.reportRepository.findById(id);

    if (!report) {
      throw new Error("Reporte no encontrado");
    }

    return report;
  }
}