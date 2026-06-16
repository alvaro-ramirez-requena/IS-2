import { prisma } from "../config/prisma";
import { EvidencePhase } from "@prisma/client";

export class FieldWorkRepository {

  // Crear registro de trabajo de campo al iniciar atención
  async create(reportId: string, technicianId: string) {
    return await prisma.fieldWork.create({
      data: {
        reportId,
        technicianId,
      },
    });
  }

  // Buscar por reporte
  async findByReportId(reportId: string) {
    return await prisma.fieldWork.findUnique({
      where: { reportId },
      include: {
        evidences: true,
        technician: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Buscar por ID del registro
  async findById(id: string) {
    return await prisma.fieldWork.findUnique({
      where: { id },
      include: {
        evidences: true,
      },
    });
  }

  // Registrar hora de llegada + ubicación del técnico
  async registerArrival(
    reportId: string,
    arrivedAt: Date,
    arrivalLat?: number,
    arrivalLng?: number,
    distanceMeters?: number
  ) {
    return await prisma.fieldWork.update({
      where: { reportId },
      data: {
        arrivedAt,
        arrivalLat,
        arrivalLng,
        distanceMeters,
      },
    });
  }

  // Guardar notas de trabajo
  async updateNotes(reportId: string, notes: string) {
    return await prisma.fieldWork.update({
      where: { reportId },
      data: { notes },
    });
  }

  // Registrar hora de cierre
  async registerClosure(reportId: string, closedAt: Date) {
    return await prisma.fieldWork.update({
      where: { reportId },
      data: { closedAt },
    });
  }

  // Agregar evidencia (foto antes o después)
  async addEvidence(
    fieldWorkId: string,
    imageUrl: string,
    phase: EvidencePhase
  ) {
    return await prisma.fieldWorkEvidence.create({
      data: {
        fieldWorkId,
        imageUrl,
        phase,
      },
    });
  }

  // Eliminar evidencia
  async removeEvidence(evidenceId: string) {
    return await prisma.fieldWorkEvidence.delete({
      where: { id: evidenceId },
    });
  }
}