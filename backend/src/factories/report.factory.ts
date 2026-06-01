import {
  Status,
  ReportCategory,
} from "@prisma/client";

type CreateReportDTO = {

  category: ReportCategory;

  problemType: string;

  description: string;

  latitude?: number;

  longitude?: number;

  address?: string;

  isAnonymous?: boolean;

  userId: string;
};

export class ReportFactory {

  static create(
    data: CreateReportDTO
  ) {

    return {

      category:
        data.category,

      problemType:
        data.problemType,

      description:
        data.description,

      latitude:
        data.latitude,

      longitude:
        data.longitude,

      address:
        data.address,

      isAnonymous:
        data.isAnonymous ?? false,

      userId:
        data.userId,

      status:
        Status.REGISTERED,
    };
  }
}