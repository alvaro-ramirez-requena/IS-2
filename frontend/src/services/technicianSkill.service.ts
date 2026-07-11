const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

const API_BASE =
    API_URL.endsWith("/api")
        ? API_URL
        : `${API_URL}/api`;

export type TechnicianSkill = {
    id: string;
    name: string;
    description?: string | null;
    active: boolean;
};

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

export const TechnicianSkillService = {
    async getAll() {
        const response =
            await fetch(
                `${API_BASE}/technician-skills`
            );

        return await parseResponse<TechnicianSkill[]>(
            response,
            "No se pudieron cargar las habilidades técnicas."
        );
    },

    async getActive() {
        const response =
            await fetch(
                `${API_BASE}/technician-skills/active`
            );

        return await parseResponse<TechnicianSkill[]>(
            response,
            "No se pudieron cargar las habilidades técnicas activas."
        );
    },

    async create(data: {
        name: string;
        description?: string;
    }) {
        const response =
            await fetch(
                `${API_BASE}/technician-skills`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

        return await parseResponse<TechnicianSkill>(
            response,
            "No se pudo crear la habilidad técnica."
        );
    },

    async update(
        id: string,
        data: {
            name?: string;
            description?: string;
            active?: boolean;
        }
    ) {
        const response =
            await fetch(
                `${API_BASE}/technician-skills/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

        return await parseResponse<TechnicianSkill>(
            response,
            "No se pudo actualizar la habilidad técnica."
        );
    },

    async toggle(
        id: string,
        active: boolean
    ) {
        const response =
            await fetch(
                `${API_BASE}/technician-skills/${id}/${active ? "activate" : "deactivate"}`,
                {
                    method: "PATCH",
                }
            );

        return await parseResponse<TechnicianSkill>(
            response,
            "No se pudo cambiar el estado de la habilidad técnica."
        );
    },
};