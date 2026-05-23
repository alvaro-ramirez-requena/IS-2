import type {
  CreateReportDTO,
  ApiReport,
} from "../types/report.types";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

export class ReportService {
  static async createReport(
    dto: CreateReportDTO
  ): Promise<ApiReport> {

    const response = await fetch(
      `${API_URL}/api/reports`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dto),
      }
    );

    if (!response.ok) {

      let message =
        "No se pudo registrar el reporte";

      try {
        const error = await response.json();

        message = error?.message || message;

      } catch { }

      throw new Error(message);
    }

    return response.json();


  }

  static async uploadImage(
    image: File
  ): Promise<string> {

    const formData =
      new FormData();

    formData.append(
      "image",
      image
    );

    const response =
      await fetch(
        `${API_URL}/api/uploads`,
        {
          method: "POST",

          body: formData,
        }
      );

    if (!response.ok) {

      throw new Error(
        "No se pudo subir la imagen"
      );
    }

    const data =
      await response.json();

    return data.imageUrl;
  }
}