import {
  ReportRetentionRepository,
} from "../repositories/report-retention.repository";

const reportRetentionRepository =
  new ReportRetentionRepository();

export class ReportRetentionService {
  async getConfiguration() {
    return await reportRetentionRepository.getOrCreate();
  }

  async updateConfiguration(data: {
    days: number;
  }) {
    const days =
      Number(data.days);

    if (
      Number.isNaN(days) ||
      !Number.isFinite(days)
    ) {
      throw new Error(
        "La cantidad de días debe ser un número válido."
      );
    }

    if (!Number.isInteger(days)) {
      throw new Error(
        "La cantidad de días debe ser un número entero."
      );
    }

    if (days <= 0) {
      throw new Error(
        "La cantidad de días debe ser mayor a cero."
      );
    }

    if (days > 365) {
      throw new Error(
        "La cantidad de días no puede ser mayor a 365."
      );
    }

    const currentConfiguration =
      await reportRetentionRepository.getOrCreate();

    return await reportRetentionRepository.update(
      currentConfiguration.id,
      days
    );
  }
}