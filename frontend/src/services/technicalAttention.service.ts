const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

const API_BASE =
    API_URL.endsWith("/api")
        ? API_URL
        : `${API_URL}/api`;

export type TechnicalAttentionRequest = {
    reportId: string;
    technicianId: string;
    checklist: Record<string, boolean>;
    fieldValues: Record<string, string>;
    actionTaken: string;
    technicalResult: string;
    observations?: string;
};

export const TechnicalAttentionService = {
    async createAttention(
        data: TechnicalAttentionRequest
    ) {
        const response =
            await fetch(
                `${API_BASE}/technical-attentions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

        const result =
            await response.json()
                .catch(() => null);

        if (!response.ok) {
            throw new Error(
                result?.message ||
                "No se pudo registrar la atención técnica."
            );
        }

        return result;
    },

    async getLatestByReport(
        reportId: string
    ) {
        const response =
            await fetch(
                `${API_BASE}/technical-attentions/report/${reportId}/latest`
            );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    },
};