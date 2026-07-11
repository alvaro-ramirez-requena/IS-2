import { Status, ReportCategory } from "@prisma/client";

type CreateReportDTO = {
  title: string;
  category: ReportCategory;
  problemType: string;
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  isAnonymous?: boolean;
  userId: string;
  municipalityId?: string;
};

export class ReportFactory {
  static create(data: CreateReportDTO) {
    return {
      title: data.title,
      category: data.category,
      problemType: data.problemType,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      isAnonymous: data.isAnonymous || false,
      userId: data.userId,
      municipalityId: data.municipalityId,
      status: Status.REGISTERED,
    };
  }
}
