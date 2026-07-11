import type { ReportFormValues, CreateReportDTO } from "../types/report.types";

export class ReportFactory {
  static toCreateReportDTO(formData: ReportFormValues, userId: string): CreateReportDTO {
    console.log("formData antes de crear DTO:", formData);

    return {
      title: formData.title.trim(),

      category: formData.category,

      problemType: formData.problemType,

      description: formData.description.trim(),

      isAnonymous: formData.isAnonymous,

      latitude: formData.latitude,

      longitude: formData.longitude,

      address: formData.address,

      imageUrls: formData.imageUrls,

      userId,
    };
  }
}
