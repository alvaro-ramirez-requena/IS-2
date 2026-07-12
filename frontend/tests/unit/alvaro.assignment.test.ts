import {
  describe,
  expect,
  test,
} from "vitest";

import type {
  Technician,
} from "../../src/types/assignment.types";

import {
  getCompatibilityLabel,
  getSuggestedSkillByProblemType,
  getTechnicianScore,
  technicianHasSkill,
} from "../../src/utils/assignment.utils";

function createTechnician(
  skills: string[],
  available = true,
  municipalityId: string | null = "municipality-1"
) {
  return {
    id: "tech-1",
    firstName: "David",
    lastName: "Lang",
    email: "david.lang@reportaya.pe",
    technicianProfile: {
      skills,
      available,
      municipalityId,
      crewName: "Cuadrilla A",
      municipality: {
        id: municipalityId || "",
        name: "Municipalidad de Los Olivos",
      },
    },
  } as unknown as Technician;
}

describe("Pruebas unitarias de Alvaro Ramirez - HU15 Asignacion de tecnico", () => {
  test("PU01 - debe sugerir Recojo de residuos para acumulación de basura", () => {
    const result =
      getSuggestedSkillByProblemType("Acumulación de basura");

    expect(result).toBe("Recojo de residuos");
  });

  test("PU02 - debe sugerir Mantenimiento de pistas y baches para bache en pista", () => {
    const result =
      getSuggestedSkillByProblemType("Bache en pista principal");

    expect(result).toBe("Mantenimiento de pistas y baches");
  });

  test("PU03 - debe sugerir Alumbrado público para alumbrado defectuoso", () => {
    const result =
      getSuggestedSkillByProblemType("Alumbrado público defectuoso");

    expect(result).toBe("Alumbrado público");
  });

  test("PU04 - debe retornar vacío cuando el tipo de problema no es reconocido", () => {
    const result =
      getSuggestedSkillByProblemType("Problema no clasificado");

    expect(result).toBe("");
  });

  test("PU05 - debe identificar que el técnico tiene una habilidad compatible", () => {
    const technician =
      createTechnician([
        "Recojo de residuos",
        "Áreas verdes y contaminación",
      ]);

    const result =
      technicianHasSkill(
        technician,
        "Recojo de residuos"
      );

    expect(result).toBe(true);
  });

  test("PU06 - debe identificar que el técnico no tiene la habilidad requerida", () => {
    const technician =
      createTechnician([
        "Alumbrado público",
      ]);

    const result =
      technicianHasSkill(
        technician,
        "Recojo de residuos"
      );

    expect(result).toBe(false);
  });

  test("PU07 - debe calcular compatibilidad alta para técnico disponible, municipalidad asignada y habilidad compatible", () => {
    const technician =
      createTechnician([
        "Recojo de residuos",
      ]);

    const score =
      getTechnicianScore(
        technician,
        "Recojo de residuos"
      );

    expect(score).toBe(10);
    expect(getCompatibilityLabel(score)).toBe("Alta");
  });

  test("PU08 - debe calcular compatibilidad media si el técnico está disponible y tiene municipalidad, pero no habilidad compatible", () => {
    const technician =
      createTechnician([
        "Alumbrado público",
      ]);

    const score =
      getTechnicianScore(
        technician,
        "Recojo de residuos"
      );

    expect(score).toBe(5);
    expect(getCompatibilityLabel(score)).toBe("Media");
  });

  test("PU09 - debe calcular compatibilidad baja si el técnico no tiene perfil", () => {
    const technician =
      {
        id: "tech-2",
        firstName: "Carlos",
        lastName: "Rojas",
        email: "carlos.rojas@reportaya.pe",
        technicianProfile: null,
      } as unknown as Technician;

    const score =
      getTechnicianScore(
        technician,
        "Recojo de residuos"
      );

    expect(score).toBe(0);
    expect(getCompatibilityLabel(score)).toBe("Baja");
  });

  test("PU10 - debe clasificar correctamente los niveles de compatibilidad", () => {
    expect(getCompatibilityLabel(9)).toBe("Alta");
    expect(getCompatibilityLabel(5)).toBe("Media");
    expect(getCompatibilityLabel(2)).toBe("Baja");
  });
});