import { AssignmentRepository } from "../repositories/assignment.repository";

import { ReportRepository } from "../repositories/report.repository";

import { Status } from "@prisma/client";

import { UserRepository } from "../repositories/user.repository";

export class AssignmentService {
  private assignmentRepository = new AssignmentRepository();

  private reportRepository = new ReportRepository();

  private userRepository = new UserRepository();

  async getTechnicians(filters?: { zone?: string; specialty?: string; availability?: boolean }) {
    return await this.assignmentRepository.getTechnicians(filters);
  }

  async getAssignmentsByReport(reportId: string) {
    return await this.assignmentRepository.getAssignmentsByReport(reportId);
  }
  async getAssignmentsByTechnician(technicianId: string) {
    return await this.assignmentRepository.getAssignmentsByTechnician(technicianId);
  }

  async reassignReport(data: {
    reportId: string;
    technicianId: string;
    assignedById: string;
    notes?: string;
  }) {
    const currentAssignment = await this.assignmentRepository.getActiveAssignment(data.reportId);

    if (!currentAssignment) {
      throw new Error("El reporte no tiene una asignación activa");
    }

    await this.assignmentRepository.deactivateAssignment(currentAssignment.id);

    await this.userRepository.updateAvailability(currentAssignment.technicianId, true);

    const assignment = await this.assignmentRepository.assignReport(
      data.reportId,
      data.technicianId,
      data.assignedById,
      data.notes
    );

    await this.userRepository.updateAvailability(data.technicianId, false);

    return assignment;
  }

  async assignReport(data: {
    reportId: string;
    technicianId: string;
    assignedById: string;
    notes?: string;
  }) {
    const report = await this.reportRepository.findById(data.reportId);

    if (!report) {
      throw new Error("Reporte no encontrado");
    }

    if (report.status !== Status.PRIORITIZED) {
      throw new Error("Solo se pueden asignar reportes priorizados");
    }

    const assignment = await this.assignmentRepository.assignReport(
      data.reportId,
      data.technicianId,
      data.assignedById,
      data.notes
    );

    await this.userRepository.updateAvailability(data.technicianId, false);

    await this.reportRepository.updateStatus(data.reportId, Status.ASSIGNED);

    return assignment;
  }
}
