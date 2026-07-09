import { ProblemTypeRepository } from "../repositories/problem-type.repository";
import { CategoryRepository } from "../repositories/category.repository";

export class ProblemTypeService {

    private problemTypeRepository =
        new ProblemTypeRepository();

    private categoryRepository =
        new CategoryRepository();

    async getAll() {
        return await this
            .problemTypeRepository
            .getAll();
    }

    async getById(id: string) {

        const problemType =
            await this
                .problemTypeRepository
                .getById(id);

        if (!problemType) {
            throw new Error(
                "Tipo de problema no encontrado"
            );
        }

        return problemType;
    }

    async create(data: {
        name: string;
        description?: string;
        categoryId: string;
    }) {

        const category =
            await this
                .categoryRepository
                .getById(data.categoryId);

        if (!category) {
            throw new Error(
                "La categoría no existe"
            );
        }

        const existingProblemType =
            await this
                .problemTypeRepository
                .getByNameAndCategory(
                    data.name,
                    data.categoryId
                );

        if (existingProblemType) {
            throw new Error(
                "Ya existe un tipo de problema con ese nombre en esta categoría"
            );
        }

        return await this
            .problemTypeRepository
            .create(data);
    }

    async update(
        id: string,
        data: {
            name?: string;
            description?: string;
            categoryId?: string;
        }
    ) {

        const problemType =
            await this
                .problemTypeRepository
                .getById(id);

        if (!problemType) {
            throw new Error(
                "Tipo de problema no encontrado"
            );
        }

        if (data.categoryId) {

            const category =
                await this
                    .categoryRepository
                    .getById(data.categoryId);

            if (!category) {
                throw new Error(
                    "La categoría no existe"
                );
            }
        }

        const name =
            data.name ?? problemType.name;

        const categoryId =
            data.categoryId ??
            problemType.categoryId;

        const existingProblemType =
            await this
                .problemTypeRepository
                .getByNameAndCategory(
                    name,
                    categoryId
                );

        if (
            existingProblemType &&
            existingProblemType.id !== id
        ) {
            throw new Error(
                "Ya existe un tipo de problema con ese nombre en esta categoría"
            );
        }

        return await this
            .problemTypeRepository
            .update(id, data);
    }

    async delete(id: string) {

        const problemType =
            await this
                .problemTypeRepository
                .getById(id);

        if (!problemType) {
            throw new Error(
                "Tipo de problema no encontrado"
            );
        }

        return await this
            .problemTypeRepository
            .delete(id);
    }

}