import type{
  ReportFormValues,
  CreateReportDTO,
} from "../types/report.types";

export class ReportFactory {
  static toCreateReportDTO(
    formData: ReportFormValues,
    userId: string
  ): CreateReportDTO {
    return {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      category: formData.category,
      userId,
    };
  }
}