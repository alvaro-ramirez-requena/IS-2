import type { AssignmentRequest } from "../types/assignment.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const API_BASE = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

export const AssignmentService = {
  async getTechnicians(filters?: {
    municipalityId?: string;
    specialty?: string;
    availability?: boolean;
  }) {
    const params = new URLSearchParams();

    if (filters?.municipalityId) {
      params.append("municipalityId", filters.municipalityId);
    }

    if (filters?.specialty) {
      params.append("specialty", filters.specialty);
    }

    if (filters?.availability !== undefined) {
      params.append("availability", String(filters.availability));
    }

    const queryString = params.toString();

    const response = await fetch(
      `${API_BASE}/assignments/technicians${queryString ? `?${queryString}` : ""}`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.message || "No se pudieron cargar los técnicos.");
    }

    return await response.json();
  },

  async assignTechnician(data: AssignmentRequest) {
    const response = await fetch(`${API_BASE}/assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.message || "No se pudo asignar el técnico.");
    }

    return await response.json();
  },

  async reassignTechnician(data: AssignmentRequest) {
    const response = await fetch(`${API_BASE}/assignments/reassign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.message || "No se pudo reasignar el técnico.");
    }

    return await response.json();
  },

  async getAssignmentsByReport(reportId: string) {
    const response = await fetch(`${API_BASE}/assignments/report/${reportId}`);

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.message || "No se pudieron cargar las asignaciones.");
    }

    return await response.json();
  },

  async getAssignmentsByTechnician(technicianId: string) {
    const response = await fetch(`${API_BASE}/assignments/technician/${technicianId}`);

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.message || "No se pudieron cargar los trabajos asignados.");
    }

    return await response.json();
  },
};
