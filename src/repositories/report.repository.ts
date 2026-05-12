import { prisma } from "../config/prisma";
import { Status } from "@prisma/client";

type CreateReportInput = {
  title: string;
  description: string;
  location: string;
  userId: string;
  status: Status;
};

export class ReportRepository {
  async create(data: CreateReportInput) {
    return await prisma.report.create({
      data,
    });
  }

  async findByUser(userId: string) {
    return await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return await prisma.report.findUnique({
      where: { id },
    });
  }
}