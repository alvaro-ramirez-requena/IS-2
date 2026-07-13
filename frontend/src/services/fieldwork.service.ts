const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const API_BASE = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

export type EvidencePhase = "BEFORE" | "AFTER";

export type FieldWorkEvidence = {
  id: string;
  imageUrl: string;
  phase: EvidencePhase;
  createdAt: string;
};

export type FieldWork = {
  id: string;
  reportId: string;
  technicianId: string;
  arrivedAt?: string | null;
  closedAt?: string | null;
  arrivalLat?: number | null;
  arrivalLng?: number | null;
  distanceMeters?: number | null;
  notes?: string | null;
  evidences: FieldWorkEvidence[];
};

export const FieldWorkService = {
  async getByReport(reportId: string) {
    const response = await fetch(`${API_BASE}/fieldwork/${reportId}`);

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as FieldWork | null;
  },

  async start(reportId: string, technicianId: string) {
    const response = await fetch(`${API_BASE}/fieldwork/${reportId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        technicianId,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || "No se pudo iniciar la trazabilidad.");
    }

    return result as FieldWork;
  },

  async registerArrival(data: {
    reportId: string;
    technicianId: string;
    arrivalLat: number;
    arrivalLng: number;
  }) {
    const response = await fetch(`${API_BASE}/fieldwork/${data.reportId}/arrive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        technicianId: data.technicianId,

        arrivalLat: data.arrivalLat,

        arrivalLng: data.arrivalLng,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || "No se pudo registrar la llegada.");
    }

    return result as FieldWork;
  },

  async saveNotes(reportId: string, notes: string) {
    const response = await fetch(`${API_BASE}/fieldwork/${reportId}/notes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || "No se pudieron guardar las notas.");
    }

    return result as FieldWork;
  },

  async addEvidence(data: {
    reportId: string;
    technicianId: string;
    imageUrl: string;
    phase: EvidencePhase;
  }) {
    const response = await fetch(`${API_BASE}/fieldwork/${data.reportId}/evidence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        technicianId: data.technicianId,

        imageUrl: data.imageUrl,

        phase: data.phase,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || "No se pudo registrar la evidencia.");
    }

    return result as FieldWork;
  },

  async deleteEvidence(evidenceId: string) {
    const response = await fetch(`${API_BASE}/fieldwork/evidence/${evidenceId}`, {
      method: "DELETE",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || "No se pudo eliminar la evidencia.");
    }

    return result as FieldWork;
  },

  async close(reportId: string) {
    const response = await fetch(`${API_BASE}/fieldwork/${reportId}/close`, {
      method: "PATCH",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || "No se pudo cerrar el trabajo de campo.");
    }

    return result;
  },
};
