import type {
    Category,
    CreateCategoryDTO,
    UpdateCategoryDTO,
} from "../types/category.types";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

export class CategoryService {

    static async getAll(): Promise<Category[]> {

        const response = await fetch(
            `${API_URL}/api/categories`
        );

        if (!response.ok) {

            throw new Error(
                "No se pudieron obtener las categorías"
            );

        }

        return response.json();

    }

    static async create(
        data: CreateCategoryDTO
    ): Promise<Category> {

        const response = await fetch(
            `${API_URL}/api/categories`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body:
                    JSON.stringify(data),
            }
        );

        if (!response.ok) {

            const error =
                await response.json();

            throw new Error(
                error.message
            );

        }

        return response.json();

    }

    static async update(
        id: string,
        data: UpdateCategoryDTO
    ): Promise<Category> {

        const response = await fetch(
            `${API_URL}/api/categories/${id}`,
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

            const error =
                await response.json();

            throw new Error(
                error.message
            );

        }

        return response.json();

    }

    static async delete(
        id: string
    ): Promise<void> {

        const response = await fetch(
            `${API_URL}/api/categories/${id}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {

            const error =
                await response.json();

            throw new Error(
                error.message
            );

        }

    }

}