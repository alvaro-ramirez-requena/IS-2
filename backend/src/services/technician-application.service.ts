import { TechnicianApplicationRepository } from "../repositories/technician-application.repository";

const technicianApplicationRepository =
  new TechnicianApplicationRepository();

export class TechnicianApplicationService {

  async createApplication(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dni?: string;
    municipalityId?: string;
    skills: string[];
    experience?: string;
  }) {

    if (!data.firstName || !data.lastName || !data.email) {
      throw new Error("Nombre, apellido y correo son obligatorios.");
    }

    if (!data.municipalityId) {
      throw new Error("Debe seleccionar una municipalidad.");
    }

    if (!data.skills || data.skills.length === 0) {
      throw new Error("Debe seleccionar al menos una habilidad.");
    }

    const existingUser =
      await technicianApplicationRepository.findUserByEmail(
        data.email
      );

    if (existingUser) {
      throw new Error(
        "Este correo ya está registrado en el sistema. Usa otro correo para postular como técnico."
      );
    }

    return await technicianApplicationRepository.create(data);
  }

  async getPendingApplications() {
    return await technicianApplicationRepository.findPending();
  }

  async getAllApplications() {
    return await technicianApplicationRepository.findAll();
  }

  async getPendingApplicationsForOperator(
    operatorId: string
  ) {
    const operator =
      await technicianApplicationRepository.findOperatorById(
        operatorId
      );

    if (!operator) {
      throw new Error("Operador no encontrado.");
    }

    if (operator.role !== "OPERATOR") {
      throw new Error("El usuario no es operador municipal.");
    }

    if (!operator.municipalityId) {
      throw new Error("El operador no tiene municipalidad asignada.");
    }

    return await technicianApplicationRepository
      .findPendingByMunicipality(
        operator.municipalityId
      );
  }

  async approveApplication(
    applicationId: string,
    reviewedById?: string
  ) {
    return await technicianApplicationRepository.approve(
      applicationId,
      reviewedById
    );
  }

  async rejectApplication(
    applicationId: string,
    reviewedById?: string
  ) {
    return await technicianApplicationRepository.reject(
      applicationId,
      reviewedById
    );
  }
}