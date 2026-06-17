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

  return errors;
};