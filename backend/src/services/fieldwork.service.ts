import { EvidencePhase, Status } from "@prisma/client";

import { FieldWorkRepository } from "../repositories/fieldwork.repository";

const fieldWorkRepository = new FieldWorkRepository();

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusMeters = 6371000;

  const dLat = toRadians(lat2 - lat1);

  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadiusMeters * c);
}

export class FieldWorkService {
  async getByReport(reportId: string) {
    return await fieldWorkRepository.findByReport(reportId);
  }

  async startFieldWork(data: { reportId: string; technicianId: string }) {
    if (!data.reportId) {
      throw new Error("El reporte es obligatorio.");
    }

    if (!data.technicianId) {
      throw new Error("El técnico es obligatorio.");
    }

    const report = await fieldWorkRepository.findReportById(data.reportId);

    if (!report) {
      throw new Error("Reporte no encontrado.");
    }

    if (report.status !== Status.IN_PROGRESS) {
      throw new Error("La trazabilidad solo puede iniciarse cuando el reporte está en atención.");
    }

    const activeAssignment = report.assignments.find(
      (assignment) => assignment.active && assignment.technicianId === data.technicianId
    );

    if (!activeAssignment) {
      throw new Error("Este reporte no está asignado al técnico actual.");
    }

    return await fieldWorkRepository.start(data.reportId, data.technicianId);
  }

  async registerArrival(data: {
    reportId: string;
    technicianId: string;
    arrivalLat: number;
    arrivalLng: number;
  }) {
    const report = await fieldWorkRepository.findReportById(data.reportId);

    if (!report) {
      throw new Error("Reporte no encontrado.");
    }

    if (report.status !== Status.IN_PROGRESS) {
      throw new Error("Solo se puede registrar llegada cuando el reporte está en atención.");
    }

    let distanceMeters: number | undefined = undefined;

    if (
      report.latitude !== null &&
      report.latitude !== undefined &&
      report.longitude !== null &&
      report.longitude !== undefined
    ) {
      distanceMeters = calculateDistanceMeters(
        report.latitude,
        report.longitude,
        data.arrivalLat,
        data.arrivalLng
      );
    }

    return await fieldWorkRepository.registerArrival({
      reportId: data.reportId,

      technicianId: data.technicianId,

      arrivalLat: data.arrivalLat,

      arrivalLng: data.arrivalLng,

      distanceMeters,
    });
  }

  async saveNotes(data: { reportId: string; notes: string }) {
    const fieldWork = await fieldWorkRepository.findByReport(data.reportId);

    if (!fieldWork) {
      throw new Error("Primero debes iniciar la trazabilidad del trabajo.");
    }

    if (!data.notes.trim()) {
      throw new Error("Las notas de trabajo son obligatorias.");
    }

    return await fieldWorkRepository.saveNotes(data.reportId, data.notes.trim());
  }

  async addEvidence(data: {
    reportId: string;
    technicianId: string;
    imageUrl: string;
    phase: EvidencePhase;
  }) {
    if (!data.imageUrl) {
      throw new Error("La imagen es obligatoria.");
    }

    if (data.phase !== EvidencePhase.BEFORE && data.phase !== EvidencePhase.AFTER) {
      throw new Error("La fase de evidencia no es válida.");
    }

    return await fieldWorkRepository.addEvidence(data);
  }

  async closeFieldWork(reportId: string) {
    const fieldWork = await fieldWorkRepository.findByReport(reportId);

    if (!fieldWork) {
      throw new Error("No existe trazabilidad registrada para este reporte.");
    }

    if (!fieldWork.arrivedAt) {
      throw new Error("Debes registrar la hora de llegada antes de cerrar.");
    }

    if (!fieldWork.notes?.trim()) {
      throw new Error("Debes registrar notas de trabajo antes de cerrar.");
    }

    const hasBefore = fieldWork.evidences.some(
      (evidence) => evidence.phase === EvidencePhase.BEFORE
    );

    const hasAfter = fieldWork.evidences.some((evidence) => evidence.phase === EvidencePhase.AFTER);

    if (!hasBefore) {
      throw new Error("Debes adjuntar al menos una foto antes de la intervención.");
    }

    if (!hasAfter) {
      throw new Error("Debes adjuntar al menos una foto después de la intervención.");
    }

    return await fieldWorkRepository.close(reportId);
  }
  async deleteEvidence(evidenceId: string) {
    if (!evidenceId) {
      throw new Error("La evidencia es obligatoria.");
    }

    return await fieldWorkRepository.deleteEvidence(evidenceId);
  }
}
