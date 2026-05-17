import { prisma } from "../config/prisma";

export async function listCategories(districtId?: string) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!districtId) {
    return categories.map((category) => ({
      ...category,
      reportCount: 0,
    }));
  }

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