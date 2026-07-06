import { prisma } from "../config/prisma";

export class CategoryRepository {

    async getAll() {
        return await prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
        });
    }

    async getById(id: string) {
        return await prisma.category.findUnique({
            where: {
                id,
            },
        });
    }

    async getByName(name: string) {
        return await prisma.category.findUnique({
            where: {
                name,
            },
        });
    }

    async create(data: {
        name: string;
        description?: string;
    }) {
        return await prisma.category.create({
            data,
        });
    }

    async update(
        id: string,
        data: {
            name?: string;
            description?: string;
        }
    ) {
        return await prisma.category.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: string) {
        return await prisma.category.delete({
            where: {
                id,
            },
        });
    }


    async hasProblemTypes(
        categoryId: string
    ) {
        const count =
            await prisma.problemType.count({
                where: {
                    categoryId,
                },
            });

        return count > 0;
    }
}