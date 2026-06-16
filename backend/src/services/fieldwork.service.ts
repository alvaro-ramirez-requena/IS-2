import { FieldWorkRepository } from "../repositories/fieldwork.repository";
import { ReportRepository } from "../repositories/report.repository";
import { UploadService } from "./upload.service";
import { EvidencePhase } from "@prisma/client";

// Calcula distancia en metros entre dos coordenadas (fórmula Haversine)
function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export class FieldWorkService {

  private fieldWorkRepository = new FieldWorkRepository();
  private reportRepository = new ReportRepository();
  private uploadService = new UploadService();

  // Iniciar registro de trabajo en campo
  async startFieldWork(reportId: string, technicianId: string) {
    // Verifica que el reporte exista
    const report = await this.reportRepository.findById(reportId);
    if (!report) throw new Error("Reporte no encontrado");

    // Verifica que no tenga ya un FieldWork activo
    const existing = await this.fieldWorkRepository.findByReportId(reportId);
    if (existing) return existing; // Si ya existe, lo devuelve sin duplicar

    return await this.fieldWorkRepository.create(reportId, technicianId);
  }

  // Registrar llegada al punto del reporte
  async registerArrival(
    reportId: string,
    technicianLat?: number,
    technicianLng?: number
  ) {
    const arrivedAt = new Date();

    let distanceMeters: number | undefined;

    // Si el técnico comparte su ubicación, calcula distancia al reporte
    if (technicianLat !== undefined && technicianLng !== undefined) {
      const report = await this.reportRepository.findById(reportId);
      if (report?.latitude && report?.longitude) {
        distanceMeters = getDistanceMeters(
          technicianLat,
          technicianLng,
          report.latitude,
          report.longitude
        );
      }
    }

    return await this.fieldWorkRepository.registerArrival(
      reportId,
      arrivedAt,
      technicianLat,
      technicianLng,
      distanceMeters
    );
  }

  // Guardar o actualizar notas de trabajo
  async saveNotes(reportId: string, notes: string) {
    const fieldWork = await this.fieldWorkRepository.findByReportId(reportId);
    if (!fieldWork) throw new Error("Trabajo de campo no iniciado para este reporte");

    return await this.fieldWorkRepository.updateNotes(reportId, notes);
  }

  // Registrar hora de cierre
  async registerClosure(reportId: string) {
    const fieldWork = await this.fieldWorkRepository.findByReportId(reportId);
    if (!fieldWork) throw new Error("Trabajo de campo no iniciado para este reporte");
    if (!fieldWork.arrivedAt) throw new Error("Debes registrar la llegada antes de cerrar");

    return await this.fieldWorkRepository.registerClosure(reportId, new Date());
  }

  // Subir foto (antes o después) usando el mismo UploadService de US07
  async addEvidence(
    reportId: string,
    filePath: string,
    phase: EvidencePhase
  ) {
    const fieldWork = await this.fieldWorkRepository.findByReportId(reportId);
    if (!fieldWork) throw new Error("Trabajo de campo no iniciado para este reporte");

    const { imageUrl } = await this.uploadService.uploadImage(filePath);

    return await this.fieldWorkRepository.addEvidence(
      fieldWork.id,
      imageUrl,
      phase
    );
  }

  // Eliminar una evidencia
  async removeEvidence(evidenceId: string) {
    return await this.fieldWorkRepository.removeEvidence(evidenceId);
  }

  // Obtener el estado completo del trabajo de campo de un reporte
  async getFieldWork(reportId: string) {
    const fieldWork = await this.fieldWorkRepository.findByReportId(reportId);
    if (!fieldWork) throw new Error("No hay trabajo de campo registrado para este reporte");

    // Calcula duración si ya cerró
    let durationMinutes: number | null = null;
    if (fieldWork.arrivedAt && fieldWork.closedAt) {
      durationMinutes = Math.round(
        (fieldWork.closedAt.getTime() - fieldWork.arrivedAt.getTime()) / 60000
      );
    }

    return {
      ...fieldWork,
      durationMinutes,
    };
  }
}