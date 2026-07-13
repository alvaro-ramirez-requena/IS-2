import {
  describe,
  expect,
  test,
} from "vitest";

import {
  calculatePriorityByMatrix,
  parseManualTargetDate,
  validatePrioritizationFields,
} from "../../src/utils/prioritization.utils";

describe("Pruebas unitarias de Rodrigo Sarria Flores - US14 Priorizacion de reportes aprobados", () => {
  test("PU01 - debe calcular prioridad ALTO cuando impacto y probabilidad son ALTO", () => {
    const result =
      calculatePriorityByMatrix("ALTO", "ALTO");

    expect(result).toBe("ALTO");
  });

  test("PU02 - debe calcular prioridad ALTO cuando impacto es ALTO y probabilidad es MEDIO", () => {
    const result =
      calculatePriorityByMatrix("ALTO", "MEDIO");

    expect(result).toBe("ALTO");
  });

  test("PU03 - debe calcular prioridad ALTO cuando impacto es MEDIO y probabilidad es ALTO", () => {
    const result =
      calculatePriorityByMatrix("MEDIO", "ALTO");

    expect(result).toBe("ALTO");
  });

  test("PU04 - debe calcular prioridad MEDIO cuando impacto y probabilidad son MEDIO", () => {
    const result =
      calculatePriorityByMatrix("MEDIO", "MEDIO");

    expect(result).toBe("MEDIO");
  });

  test("PU05 - debe calcular prioridad MEDIO cuando impacto es ALTO y probabilidad es BAJO", () => {
    const result =
      calculatePriorityByMatrix("ALTO", "BAJO");

    expect(result).toBe("MEDIO");
  });

  test("PU06 - debe calcular prioridad MEDIO cuando impacto es BAJO y probabilidad es ALTO", () => {
    const result =
      calculatePriorityByMatrix("BAJO", "ALTO");

    expect(result).toBe("MEDIO");
  });

  test("PU07 - debe calcular prioridad BAJO cuando impacto y probabilidad son BAJO", () => {
    const result =
      calculatePriorityByMatrix("BAJO", "BAJO");

    expect(result).toBe("BAJO");
  });

  test("PU08 - debe aceptar tipo operativo y justificación válidos", () => {
    const action = () =>
      validatePrioritizationFields({
        operationalType: "Atención por cuadrilla municipal",
        justification: "El reporte requiere atención por impacto en la vía pública.",
      });

    expect(action).not.toThrow();
  });

  test("PU09 - debe rechazar priorización sin tipo operativo", () => {
    const action = () =>
      validatePrioritizationFields({
        operationalType: "",
        justification: "El reporte requiere atención prioritaria.",
      });

    expect(action).toThrow(
      "El tipo operativo es obligatorio."
    );
  });

  test("PU10 - debe rechazar fecha objetivo manual inválida", () => {
    const action = () =>
      parseManualTargetDate("fecha-invalida");

    expect(action).toThrow(
      "La fecha objetivo no es válida."
    );
  });
});