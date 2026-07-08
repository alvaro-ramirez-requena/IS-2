const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface TechnicianApplicationDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dni?: string;
    district?: string;
    skills: string[];
    experience?: string;
}

export class TechnicianApplicationService {

    static async createApplication(
        data: TechnicianApplicationDTO
    ) {
        const response =
            await fetch(`${API_URL}/technician-applications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Error al registrar postulación."
            );
        }

        return result;
    }

    static async getPendingApplications() {
        const response =
            await fetch(`${API_URL}/technician-applications/pending`);

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Error al obtener postulaciones."
            );
        }

        return result;
    }

    static async approveApplication(
        applicationId: string,
        reviewedById?: string
    ) {
        const response =
            await fetch(
                `${API_URL}/technician-applications/${applicationId}/approve`,
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

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Error al aprobar postulación."
            );
        }

        return result;
    }

    static async rejectApplication(
        applicationId: string,
        reviewedById?: string
    ) {
        const response =
            await fetch(
                `${API_URL}/technician-applications/${applicationId}/reject`,
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

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Error al rechazar postulación."
            );
        }

        return result;
    }
}