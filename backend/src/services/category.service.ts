import { CategoryRepository } from "../repositories/category.repository";

export class CategoryService {

    private categoryRepository =
        new CategoryRepository();

    async getAll() {
        return await this
            .categoryRepository
            .getAll();
    }

    async getById(id: string) {

        const category =
            await this
                .categoryRepository
                .getById(id);

        if (!category) {
            throw new Error(
                "Categoría no encontrada"
            );
        }

        return category;
    }

    async create(data: {
        name: string;
        description?: string;
    }) {

        const existingCategory =
            await this
                .categoryRepository
                .getByName(data.name);

        if (existingCategory) {
            throw new Error(
                "Ya existe una categoría con ese nombre"
            );
        }

        return await this
            .categoryRepository
            .create(data);
    }

    async update(
        id: string,
        data: {
            name?: string;
            description?: string;
        }
    ) {

        const category =
            await this
                .categoryRepository
                .getById(id);

        if (!category) {
            throw new Error(
                "Categoría no encontrada"
            );
        }

        if (data.name) {

            const existingCategory =
                await this
                    .categoryRepository
                    .getByName(data.name);

            if (
                existingCategory &&
                existingCategory.id !== id
            ) {
                throw new Error(
                    "Ya existe una categoría con ese nombre"
                );
            }
        }

        return await this
            .categoryRepository
            .update(id, data);
    }

    async delete(id: string) {

        const category =
            await this
                .categoryRepository
                .getById(id);

        if (!category) {
            throw new Error(
                "Categoría no encontrada"
            );
        }

        const hasProblemTypes =
            await this
                .categoryRepository
                .hasProblemTypes(id);

        if (hasProblemTypes) {
            throw new Error(
                "No se puede eliminar la categoría porque tiene tipos de problema asociados"
            );
        }

        return await this
            .categoryRepository
            .delete(id);
    }

}