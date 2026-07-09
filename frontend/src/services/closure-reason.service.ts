import type {
    ClosureReason,
} from "../types/closure-reason.types";

const API_URL =
    "http://localhost:3000/api/closure-reasons";

export const ClosureReasonService = {

    async getAll(): Promise<ClosureReason[]> {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Error al obtener los motivos de cierre"
            );

        }

        return response.json();

    },

    async create(
        data: {
            name: string;
            description: string;
        }
    ) {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                },

                body:
                    JSON.stringify(data),

            });

        if (!response.ok) {

            throw new Error(
                "Error al crear el motivo de cierre"
            );

        }

        return response.json();

    },

    async update(
        id: string,
        data: {
            name: string;
            description: string;
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
                "Error al actualizar el motivo de cierre"
            );

        }

        return response.json();

    },

    async delete(
        id: string
    ) {

        const response =
            await fetch(

                `${API_URL}/${id}`,

                {

                    method: "DELETE",

                }

            );

        if (!response.ok) {

            throw new Error(
                "Error al eliminar el motivo de cierre"
            );

        }

    },

};