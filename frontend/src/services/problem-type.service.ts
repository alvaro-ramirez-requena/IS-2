import type {
    ProblemType,
} from "../types/problem-type.types";

const API_URL =
    "http://localhost:3000/api/problem-types";

export const ProblemTypeService = {

    async getAll(): Promise<ProblemType[]> {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Error al obtener los tipos de problema"
            );

        }

        return response.json();

    },

    async create(
        data: {
            name: string;
            description: string;
            categoryId: string;
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
                "Error al crear el tipo de problema"
            );

        }

        return response.json();

    },

    async update(
        id: string,
        data: {
            name: string;
            description: string;
            categoryId: string;
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
                "Error al actualizar el tipo de problema"
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
                "Error al eliminar el tipo de problema"
            );

        }

    },

};