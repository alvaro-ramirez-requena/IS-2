import {
  Status,
  ReportCategory,
} from "@prisma/client";

type CreateReportDTO = {

  category: ReportCategory;

  problemType: string;

  description: string;

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

      isAnonymous:
        data.isAnonymous ?? false,

      userId:
        data.userId,

      status:
        Status.REGISTERED,
    };
  }
}