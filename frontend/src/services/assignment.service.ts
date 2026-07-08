import type {
  Technician,
  ReportAssignment,
  AssignmentRequest,
} from "../types/assignment.types";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

export class AssignmentService {

  static async getTechnicians(
    filters?: {
      zone?: string;
      specialty?: string;
      availability?: boolean;
    }
  ) : Promise<Technician[]> {

    const params =
      new URLSearchParams();

    if (filters?.zone) {
      params.append(
        "zone",
        filters.zone
      );
    }

    if (filters?.specialty) {
      params.append(
        "specialty",
        filters.specialty
      );
    }

    if (
      filters?.availability !==
      undefined
    ) {
      params.append(
        "availability",
        String(filters.availability)
      );
    }

    const response =
      await fetch(
        `${API_URL}/api/assignments/technicians?${params}`
      );

    if (!response.ok) {

      throw new Error(
        "No se pudieron obtener los técnicos"
      );
    }

    return response.json();
  }

  static async getAssignmentsByReport(
    reportId: string
  ): Promise<ReportAssignment[]> {

    const response =
      await fetch(
        `${API_URL}/api/assignments/report/${reportId}`
      );

    if (!response.ok) {

      throw new Error(
        "No se pudo obtener el historial"
      );
    }

    return response.json();
  }

  static async assignReport(
    data: AssignmentRequest
  ): Promise<ReportAssignment> {

    const response =
      await fetch(
        `${API_URL}/api/assignments`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(data),
        }
      );

    if (!response.ok) {

      const error =
        await response.json();

      throw new Error(
        error.message
      );
    }

    return response.json();
  }

  static async reassignReport(
    data: AssignmentRequest
  ): Promise<ReportAssignment> {

    const response =
      await fetch(
        `${API_URL}/api/assignments/reassign`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(data),
        }
      );

    if (!response.ok) {

      const error =
        await response.json();

      throw new Error(
        error.message
      );
    }

    return response.json();
  }

}