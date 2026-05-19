import { Status, ReportCategory } from "@prisma/client";

type CreateReportDTO = {
  title: string;
  description: string;

  category: ReportCategory;

  location: string;

  latitude?: number;
  longitude?: number;

  isAnonymous?: boolean;

  userId: string;
};

export class ReportFactory {
  static create(data: CreateReportDTO) {
    return {
      title: data.title,
      description: data.description,

      category: data.category,

      location: data.location,

      latitude: data.latitude,
      longitude: data.longitude,

      isAnonymous: data.isAnonymous ?? false,

      userId: data.userId,

      status: Status.REGISTERED,
    };
  }
}