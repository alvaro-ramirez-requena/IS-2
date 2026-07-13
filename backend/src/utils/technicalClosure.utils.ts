export type TechnicalClosureValidationInput = {
  reportId?: string;
  technicianId?: string;
  result?: string;
  observations?: string;
  followUpNotes?: string;
};

export function normalizeText(value: string) {
  return value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isFollowUpReason(reasonName: string) {
  const value = normalizeText(reasonName);

  return (
    value.includes("SEGUIMIENTO") ||
    value.includes("FOLLOW")
  );
}

export function validateBasicClosureFields(
  data: TechnicalClosureValidationInput
) {
  if (!data.reportId) {
    throw new Error("El reporte es obligatorio.");
  }

  if (!data.technicianId) {
    throw new Error("El técnico es obligatorio.");
  }

  if (!data.observations?.trim()) {
    throw new Error("Las observaciones de cierre son obligatorias.");
  }
}

export function normalizeClosureResult(
  result?: string
) {
  const normalizedResult = result?.trim();

  if (!normalizedResult) {
    throw new Error("El resultado técnico es obligatorio.");
  }

  return normalizedResult;
}

export function validateFollowUpRequirement(
  followUpRequired: boolean,
  followUpNotes?: string
) {
  if (
    followUpRequired &&
    !followUpNotes?.trim()
  ) {
    throw new Error("Debes registrar las notas de seguimiento.");
  }

  return followUpNotes?.trim() || undefined;
}