import { Status } from "@prisma/client";

type CreateReportDTO = {
  title: string;
  description: string;
  location: string;
  userId: string;
};

export class ReportFactory {
  static create(data: CreateReportDTO) {
    return {
      title: data.title,
      description: data.description,
      location: data.location,
      userId: data.userId,
      status: Status.REGISTERED,
    };
  }
}