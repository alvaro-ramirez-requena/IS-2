import { prisma } from "../config/prisma";

export class AssignmentRepository {

    async getTechnicians(filters?: {
        zone?: string;
        specialty?: string;
        availability?: boolean;
    }) {
        return await prisma.user.findMany({
            where: {
                role: "TECHNICIAN",
                ...(filters?.zone && {
                    zone: filters.zone,
                }),
                ...(filters?.specialty && {
                    specialty: filters.specialty,
                }),
                ...(filters?.availability !== undefined && {
                    availability:
                        filters.availability,
                }),
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                availability: true,
                specialty: true,
                zone: true,
                crew: true,
            },
        });
    }

    async assignReport(
        reportId: string,
        technicianId: string,
        assignedById: string,
        notes?: string
    ) {
        return await prisma.reportAssignment.create({
            data: {
                reportId,
                technicianId,
                assignedById,
                notes,
            },
        });
    }


    async getAssignmentsByReport(
        reportId: string
    ) {
        return await prisma
            .reportAssignment
            .findMany({
                where: {
                    reportId,
                },
                include: {
                    technician: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    assignedBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    assignedAt: "desc",
                },
            });
    }

    async getActiveAssignment(
        reportId: string
    ) {
        return await prisma
            .reportAssignment
            .findFirst({
                where: {
                    reportId,
                    active: true,
                },
            });
    }

    async deactivateAssignment(
        assignmentId: string
    ) {
        return await prisma
            .reportAssignment
            .update({
                where: {
                    id: assignmentId,
                },
                data: {
                    active: false,
                },
            });
    }
}