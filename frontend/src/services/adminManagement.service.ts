const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

const API_BASE =
    API_URL.endsWith("/api")
        ? API_URL
        : `${API_URL}/api`;

export type AdminMunicipality = {
    id: string;
    name: string;
    district?: string | null;
    province?: string | null;
    department?: string | null;
};

export type AdminOperator = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    emailVerified: boolean;
    municipalityId?: string | null;
    municipality?: AdminMunicipality | null;
    createdAt?: string;
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

export const AdminManagementService = {
    async getMunicipalities() {
        const response =
            await fetch(
                `${API_BASE}/admin-management/municipalities`,
                {
                    headers:
                        getHeaders(),
                }
            );

        return await parseResponse<AdminMunicipality[]>(
            response,
            "No se pudieron cargar las municipalidades."
        );
    },

    async createMunicipality(data: {
        name: string;
        district?: string;
        province?: string;
        department?: string;
    }) {
        const response =
            await fetch(
                `${API_BASE}/admin-management/municipalities`,
                {
                    method:
                        "POST",

                    headers:
                        getHeaders(),

                    body:
                        JSON.stringify(data),
                }
            );

        return await parseResponse<AdminMunicipality>(
            response,
            "No se pudo crear la municipalidad."
        );
    },

    async getOperators() {
        const response =
            await fetch(
                `${API_BASE}/admin-management/operators`,
                {
                    headers:
                        getHeaders(),
                }
            );

        return await parseResponse<AdminOperator[]>(
            response,
            "No se pudieron cargar los operadores."
        );
    },

    async createOperator(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        municipalityId: string;
    }) {
        const response =
            await fetch(
                `${API_BASE}/admin-management/operators`,
                {
                    method:
                        "POST",

                    headers:
                        getHeaders(),

                    body:
                        JSON.stringify(data),
                }
            );

        return await parseResponse<AdminOperator>(
            response,
            "No se pudo crear el operador."
        );
    },
};