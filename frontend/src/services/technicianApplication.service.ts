const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface TechnicianApplicationDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dni?: string;
  municipalityId: string;
  skills: string[];
  experience?: string;
}

export class TechnicianApplicationService {
  static async createApplication(data: TechnicianApplicationDTO) {
    const response = await fetch(`${API_URL}/api/technician-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al registrar postulación.");
    }

    return result;
  }

  static async getPendingApplications() {
    const operatorId = localStorage.getItem("userId");

    if (!operatorId) {
      throw new Error("No se encontró el operador en sesión.");
    }

    const response = await fetch(
      `${API_URL}/api/technician-applications/pending?operatorId=${operatorId}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "No se pudieron obtener las postulaciones.");
    }

    return result;
  }

  static async approveApplication(applicationId: string, reviewedById?: string) {
    const response = await fetch(
      `${API_URL}/api/technician-applications/${applicationId}/approve`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewedById,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al aprobar postulación.");
    }

    return result;
  }

  static async rejectApplication(applicationId: string, reviewedById?: string) {
    const response = await fetch(`${API_URL}/api/technician-applications/${applicationId}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviewedById,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al rechazar postulación.");
    }

    return result;
  }
}
