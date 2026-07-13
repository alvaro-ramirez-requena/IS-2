export type PriorityValue = "BAJO" | "MEDIO" | "ALTO";

export type PrioritizationValidationInput = {
  operationalType?: string;
  justification?: string;
};

export function calculatePriorityByMatrix(
  impact: PriorityValue,
  probability: PriorityValue
): PriorityValue {
  if (
    (impact === "ALTO" && probability === "ALTO") ||
    (impact === "ALTO" && probability === "MEDIO") ||
    (impact === "MEDIO" && probability === "ALTO")
  ) {
    return "ALTO";
  }

  if (
    (impact === "MEDIO" && probability === "MEDIO") ||
    (impact === "ALTO" && probability === "BAJO") ||
    (impact === "BAJO" && probability === "ALTO") ||
    (impact === "MEDIO" && probability === "BAJO")
  ) {
    return "MEDIO";
  }

  return "BAJO";
}

export function validatePrioritizationFields(
  data: PrioritizationValidationInput
) {
  if (!data.operationalType?.trim()) {
    throw new Error("El tipo operativo es obligatorio.");
  }

  if (!data.justification?.trim()) {
    throw new Error("La justificación es obligatoria.");
  }
}

export function parseManualTargetDate(
  targetDate?: string
): Date | null {
  if (!targetDate) {
    return null;
  }

  const manualTargetDate =
    new Date(`${targetDate}T00:00:00`);

  if (Number.isNaN(manualTargetDate.getTime())) {
    throw new Error("La fecha objetivo no es válida.");
  }

  return manualTargetDate;
}