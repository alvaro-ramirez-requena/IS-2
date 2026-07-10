const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

export type Municipality = {
  id: string;
  name: string;
  district?: string | null;
  province?: string | null;
  department?: string | null;
};

export const MunicipalityService = {
  async getAll() {
    const response =
      await fetch(
        `${API_URL}/api/municipalities`
      );

    if (!response.ok) {
      throw new Error(
        "No se pudieron cargar las municipalidades."
      );
    }

    return await response.json() as Municipality[];
  },
};