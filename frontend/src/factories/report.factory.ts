import type {
  ReportFormValues,
  CreateReportDTO,
} from "../types/report.types";

export class ReportFactory {

  static toCreateReportDTO(
    formData: ReportFormValues,
    userId: string
  ): CreateReportDTO {

    return {

      category:
        formData.category,

      problemType:
        formData.problemType,

      description:
        formData.description.trim(),

      isAnonymous:
        formData.isAnonymous,

      latitude:
        formData.latitude,

      longitude:
        formData.longitude,

      imageUrls:
        formData.imageUrls,

      userId,
    };
  }
}