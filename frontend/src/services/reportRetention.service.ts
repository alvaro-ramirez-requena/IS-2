const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

const API_BASE =
    API_URL.endsWith("/api")
        ? API_URL
        : `${API_URL}/api`;

export type ReportRetentionConfiguration = {
    id: string;
    days: number;
    createdAt: string;
    updatedAt: string;
};

function getHeaders() {
    const token =
        localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`,
            }
            : {}),
    };
}

async function parseResponse<T>(
    response: Response,
    fallbackMessage: string
): Promise<T> {
    const result =
        await response.json()
            .catch(() => null);

    if (!response.ok) {
        throw new Error(
            result?.message ||
            fallbackMessage
        );
    }

    return result as T;
}

export const ReportRetentionService = {
    async getConfiguration() {
        const response =
            await fetch(
                `${API_BASE}/report-retention`,
                {
                    headers:
                        getHeaders(),
                }
            );

        return await parseResponse<ReportRetentionConfiguration>(
            response,
            "No se pudo cargar la configuración de retención."
        );
    },

    async updateConfiguration(days: number) {
        const response =
            await fetch(
                `${API_BASE}/report-retention`,
                {
                    method:
                        "PUT",

                    headers:
                        getHeaders(),

                    body:
                        JSON.stringify({
                            days,
                        }),
                }
            );

        return await parseResponse<ReportRetentionConfiguration>(
            response,
            "No se pudo actualizar la configuración de retención."
        );
    },
};