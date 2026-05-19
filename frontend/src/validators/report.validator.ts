import type { ReportFormValues } from "../types/report.types";

export const validateReport = (
  values: ReportFormValues
) => {
  const errors: Partial<
    Record<keyof ReportFormValues, string>
  > = {};

  if (!values.title.trim()) {
    errors.title = "El título es obligatorio";
  }

  if (!values.description.trim()) {
    errors.description = "La descripción es obligatoria";
  }

  if (!values.location.trim()) {
    errors.location = "La ubicación es obligatoria";
  }

  return errors;
};