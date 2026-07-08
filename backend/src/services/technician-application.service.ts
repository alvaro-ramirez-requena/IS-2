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
    district?: string;
    skills: string[];
    experience?: string;
  }) {

    if (!data.firstName || !data.lastName || !data.email) {
      throw new Error("Nombre, apellido y correo son obligatorios.");
    }

    if (!data.skills || data.skills.length === 0) {
      throw new Error("Debe seleccionar al menos una habilidad.");
    }

    return await technicianApplicationRepository.create(data);
  }

  async getPendingApplications() {
    return await technicianApplicationRepository.findPending();
  }

  async getAllApplications() {
    return await technicianApplicationRepository.findAll();
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