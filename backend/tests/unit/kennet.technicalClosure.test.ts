import {
  describe,
  expect,
  test,
} from "vitest";

import {
  isFollowUpReason,
  normalizeClosureResult,
  validateBasicClosureFields,
  validateFollowUpRequirement,
} from "../../src/utils/technicalClosure.utils";

describe("Pruebas unitarias de Kennet Coca - US19 Cierre de atención técnica", () => {
  test("PU01 - debe aceptar datos básicos válidos para el cierre técnico", () => {
    const action = () =>
      validateBasicClosureFields({
        reportId: "report-1",
        technicianId: "tech-1",
        observations: "Se resolvió la incidencia en campo.",
      });

    expect(action).not.toThrow();
  });

  test("PU02 - debe rechazar cierre sin reporte", () => {
    const action = () =>
      validateBasicClosureFields({
        reportId: "",
        technicianId: "tech-1",
        observations: "Se resolvió la incidencia en campo.",
      });

    expect(action).toThrow(
      "El reporte es obligatorio."
    );
  });

  test("PU03 - debe rechazar cierre sin técnico", () => {
    const action = () =>
      validateBasicClosureFields({
        reportId: "report-1",
        technicianId: "",
        observations: "Se resolvió la incidencia en campo.",
      });

    expect(action).toThrow(
      "El técnico es obligatorio."
    );
  });

  test("PU04 - debe rechazar cierre sin observaciones", () => {
    const action = () =>
      validateBasicClosureFields({
        reportId: "report-1",
        technicianId: "tech-1",
        observations: "",
      });

    expect(action).toThrow(
      "Las observaciones de cierre son obligatorias."
    );
  });

  test("PU05 - debe normalizar el resultado técnico eliminando espacios", () => {
    const result =
      normalizeClosureResult("  Resuelto en sitio  ");

    expect(result).toBe("Resuelto en sitio");
  });

  test("PU06 - debe rechazar resultado técnico vacío", () => {
    const action = () =>
      normalizeClosureResult("");

    expect(action).toThrow(
      "El resultado técnico es obligatorio."
    );
  });

  test("PU07 - debe detectar motivo de seguimiento requerido en español", () => {
    const result =
      isFollowUpReason("Seguimiento requerido");

    expect(result).toBe(true);
  });

  test("PU08 - debe detectar motivo de seguimiento requerido en inglés", () => {
    const result =
      isFollowUpReason("Follow up needed");

    expect(result).toBe(true);
  });

  test("PU09 - debe indicar que un cierre resuelto en sitio no requiere seguimiento", () => {
    const result =
      isFollowUpReason("Resuelto en sitio");

    expect(result).toBe(false);
  });

  test("PU10 - debe rechazar seguimiento requerido sin notas de seguimiento", () => {
    const action = () =>
      validateFollowUpRequirement(
        true,
        ""
      );

    expect(action).toThrow(
      "Debes registrar las notas de seguimiento."
    );
  });
});