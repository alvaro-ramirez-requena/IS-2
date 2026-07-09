import type {
    SlaConfiguration,
} from "../types/sla-configuration.types";

const API_URL =
    "http://localhost:3000/api/sla-configurations";

export const SlaConfigurationService = {

    async getAll(): Promise<SlaConfiguration[]> {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Error al obtener las configuraciones SLA"
            );

        }

        return response.json();

    },

    async update(
        id: string,
        data: {
            responseHours: number;
        }
    ) {

        const response =
            await fetch(

                `${API_URL}/${id}`,

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

            throw new Error(
                "Error al actualizar la configuración SLA"
            );

        }

        return response.json();

    },

};