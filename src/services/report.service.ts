import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";

type CreateReportInput = {
  title: string;
  description: string;
  location: string;
  categoryId: string;
  districtId: string;
  isAnonymous?: boolean;
  latitude?: number;
  longitude?: number;
  evidenceUrl?: string;
  severity?: number;
  urgency?: number;
};

export async function createReport(userId: string, data: CreateReportInput) {
  const [category, district] = await Promise.all([
    prisma.category.findUnique({ where: { id: data.categoryId } }),
    prisma.district.findUnique({ where: { id: data.districtId } }),
  ]);

  if (!category) throw new HttpError(400, "Categoría inválida");
  if (!district) throw new HttpError(400, "Distrito inválido");

  return prisma.report.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      location: data.location,
      categoryId: data.categoryId,
      districtId: data.districtId,
      isAnonymous: data.isAnonymous ?? false,
      latitude: data.latitude,
      longitude: data.longitude,
      evidenceUrl: data.evidenceUrl,
      severity: data.severity ?? 1,
      urgency: data.urgency ?? 1,
      priorityScore: (data.severity ?? 1) + (data.urgency ?? 1),
      status: "REGISTERED",
    },
    include: {
      category: true,
      district: true,
    },
  });
}

export async function listReportsByUser(userId: string) {
  return prisma.report.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      district: true,
      reviewedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function getReportById(
  reportId: string,
  requesterId: string,
  requesterRole: string
) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      category: true,
      district: true,
      reviewedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!report) {
    throw new HttpError(404, "Reporte no encontrado");
  }

  const isOwner = report.userId === requesterId;
  const isStaff = requesterRole === "OPERATOR" || requesterRole === "TECHNICIAN";

  if (!isOwner && !isStaff) {
    throw new HttpError(403, "No puedes ver este reporte");
  }

  return report;
}