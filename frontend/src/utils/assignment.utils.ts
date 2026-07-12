import type { Technician } from "../types/assignment.types";

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getSuggestedSkillByProblemType(problemType?: string) {
  if (!problemType) {
    return "";
  }

  const normalized = normalizeText(problemType);

  if (
    normalized.includes("bache") ||
    normalized.includes("pista") ||
    normalized.includes("vereda")
  ) {
    return "Mantenimiento de pistas y baches";
  }

  if (
    normalized.includes("alumbrado") ||
    normalized.includes("semaforo") ||
    normalized.includes("senalizacion")
  ) {
    return "Alumbrado público";
  }

  if (
    normalized.includes("basura") ||
    normalized.includes("residuo") ||
    normalized.includes("mal olor") ||
    normalized.includes("quema")
  ) {
    return "Recojo de residuos";
  }

  if (
    normalized.includes("area verde") ||
    normalized.includes("contaminacion")
  ) {
    return "Áreas verdes y contaminación";
  }

  if (
    normalized.includes("estacionamiento") ||
    normalized.includes("auto") ||
    normalized.includes("vehiculo") ||
    normalized.includes("congestion") ||
    normalized.includes("velocidad") ||
    normalized.includes("transporte")
  ) {
    return "Gestión de tránsito y movilidad";
  }

  if (
    normalized.includes("ruido") ||
    normalized.includes("robo") ||
    normalized.includes("asalto") ||
    normalized.includes("sospechosa") ||
    normalized.includes("alcohol")
  ) {
    return "Apoyo en seguridad ciudadana";
  }

  if (
    normalized.includes("venta ambulante") ||
    normalized.includes("comercio")
  ) {
    return "Control de comercio informal";
  }

  return "";
}

export function technicianHasSkill(
  technician: Technician,
  skill: string
) {
  if (!skill) {
    return false;
  }

  const skills =
    technician.technicianProfile?.skills || [];

  return skills.some(
    (item) =>
      normalizeText(item).includes(normalizeText(skill)) ||
      normalizeText(skill).includes(normalizeText(item))
  );
}

export function getTechnicianScore(
  technician: Technician,
  suggestedSkill: string
) {
  let score = 0;

  const profile =
    technician.technicianProfile;

  if (!profile) {
    return score;
  }

  if (profile.available) {
    score += 3;
  }

  if (profile.municipalityId) {
    score += 2;
  }

  if (
    suggestedSkill &&
    technicianHasSkill(technician, suggestedSkill)
  ) {
    score += 5;
  }

  return score;
}

export function getCompatibilityLabel(score: number) {
  if (score >= 8) {
    return "Alta";
  }

  if (score >= 5) {
    return "Media";
  }

  return "Baja";
}