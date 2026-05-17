import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";

export async function getSummary(districtId: string) {
  const [total, approved, rejected, pending] = await Promise.all([
    prisma.report.count({ where: { districtId } }),
    prisma.report.count({ where: { districtId, status: "APPROVED" } }),
    prisma.report.count({ where: { districtId, status: "REJECTED" } }),
    prisma.report.count({
      where: { districtId, status: { in: ["REGISTERED", "VALIDATING"] } },
    }),
  ]);

  return { total, approved, rejected, pending };
}

export async function getTopProblems(districtId: string) {
  const grouped = await prisma.report.groupBy({
    by: ["categoryId"],
    where: { districtId },
    _count: { categoryId: true },
    _max: { createdAt: true },
    orderBy: [
      { _count: { categoryId: "desc" } },
      { _max: { createdAt: "desc" } },
    ],
    take: 7,
  });

  const categoryIds = grouped.map((item) => item.categoryId);

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });

  const latestReports = await prisma.report.findMany({
    where: { districtId, categoryId: { in: categoryIds } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      categoryId: true,
      status: true,
      createdAt: true,
    },
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const latestMap = new Map<string, (typeof latestReports)[number]>();

  for (const report of latestReports) {
    if (!latestMap.has(report.categoryId)) {
      latestMap.set(report.categoryId, report);
    }
  }

  return grouped.map((item, index) => {
    const category = categoryMap.get(item.categoryId);

    return {
      rank: index + 1,
      categoryId: item.categoryId,
      name: category?.name || "Categoría",
      slug: category?.slug || "",
      group: category?.group || "INFRASTRUCTURE",
      icon: category?.icon || null,
      reportCount: item._count.categoryId,
      latestReportAt: item._max.createdAt,
      latestReport: latestMap.get(item.categoryId) || null,
    };
  });
}

export async function getCategoriesRows(districtId: string) {
  const categories = await prisma.category.findMany({
    orderBy: [{ group: "asc" }, { name: "asc" }],
  });

  const grouped = await prisma.report.groupBy({
    by: ["categoryId"],
    where: { districtId },
    _count: { categoryId: true },
  });

  const counts = new Map(
    grouped.map((item) => [item.categoryId, item._count.categoryId])
  );

  return categories.map((category) => ({
    ...category,
    reportCount: counts.get(category.id) || 0,
  }));
}

export async function listDistricts() {
  return prisma.district.findMany({
    orderBy: { name: "asc" },
  });
}

export async function resolveDistrictId(
  userDistrictId: string | null | undefined,
  queryDistrictId?: string
) {
  const districtId = queryDistrictId || userDistrictId;

  if (!districtId) {
    throw new HttpError(400, "Debes indicar un distrito");
  }

  const district = await prisma.district.findUnique({
    where: { id: districtId },
  });

  if (!district) {
    throw new HttpError(400, "Distrito inválido");
  }

  return districtId;
}