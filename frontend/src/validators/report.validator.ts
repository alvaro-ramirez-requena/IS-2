import type {
  ReportFormValues,
} from "../types/report.types";

export const validateReport = (
  values: ReportFormValues
) => {

  const errors:
    Partial<
      Record<
        keyof ReportFormValues,
        string
      >
    > = {};

  if (!values.category.trim()) {

    errors.category =
      "La categoría es obligatoria";
  }

  if (!values.problemType.trim()) {

    errors.problemType =
      "El tipo de problema es obligatorio";
  }

  if (!values.description.trim()) {

    errors.description =
      "La descripción es obligatoria";
  }

  if (!values.title.trim()) {
    errors.title =
      "El título del reporte es obligatorio";
  }
  if (values.title.trim().length < 5) {
    errors.title =
      "El título debe tener al menos 5 caracteres";
  }

  if (values.title.trim().length > 80) {
    errors.title =
      "El título no debe superar los 80 caracteres";
  }
  return errors;
};