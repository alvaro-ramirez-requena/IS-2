import {
  describe,
  expect,
  test,
} from "vitest";

import {
  validateTechnicianAttention,
} from "../../src/utils/technicianAttend.utils";

describe("Pruebas unitarias de Eduardo Tello Yparraguirre - US17 Atender reporte según el tipo de problema", () => {
  test("PU01 - debe aceptar atención técnica con campos, acción y resultado válidos", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [
          {
            label: "Volumen estimado",
            minLength: 3,
          },
        ],
        campos: {
          "Volumen estimado": "10 bolsas acumuladas",
        },
        accionSeleccionada: "Recojo realizado",
        resultadoSeleccionado: "Atención completada",
      });

    expect(result).toEqual({});
  });

  test("PU02 - debe rechazar campo obligatorio vacío", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [
          {
            label: "Volumen estimado",
          },
        ],
        campos: {
          "Volumen estimado": "",
        },
        accionSeleccionada: "Recojo realizado",
        resultadoSeleccionado: "Atención completada",
      });

    expect(result["Volumen estimado"]).toBe(
      "Este campo es obligatorio"
    );
  });

  test("PU03 - debe rechazar campo obligatorio con solo espacios", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [
          {
            label: "Punto exacto",
          },
        ],
        campos: {
          "Punto exacto": "   ",
        },
        accionSeleccionada: "Inspección realizada",
        resultadoSeleccionado: "Atención parcial",
      });

    expect(result["Punto exacto"]).toBe(
      "Este campo es obligatorio"
    );
  });

  test("PU04 - debe rechazar campo que no cumple longitud mínima", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [
          {
            label: "Descripción técnica",
            minLength: 10,
          },
        ],
        campos: {
          "Descripción técnica": "corto",
        },
        accionSeleccionada: "Inspección realizada",
        resultadoSeleccionado: "Atención parcial",
      });

    expect(result["Descripción técnica"]).toBe(
      "Debe tener al menos 10 caracteres"
    );
  });

  test("PU05 - debe aceptar campo que cumple exactamente la longitud mínima", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [
          {
            label: "Descripción técnica",
            minLength: 10,
          },
        ],
        campos: {
          "Descripción técnica": "1234567890",
        },
        accionSeleccionada: "Inspección realizada",
        resultadoSeleccionado: "Atención completada",
      });

    expect(result).toEqual({});
  });

  test("PU06 - debe rechazar atención sin acción técnica seleccionada", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [
          {
            label: "Volumen estimado",
          },
        ],
        campos: {
          "Volumen estimado": "10 bolsas",
        },
        accionSeleccionada: "",
        resultadoSeleccionado: "Atención completada",
      });

    expect(result.accion).toBe(
      "Debes seleccionar una acción realizada"
    );
  });

  test("PU07 - debe rechazar atención sin resultado técnico seleccionado", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [
          {
            label: "Volumen estimado",
          },
        ],
        campos: {
          "Volumen estimado": "10 bolsas",
        },
        accionSeleccionada: "Recojo realizado",
        resultadoSeleccionado: "",
      });

    expect(result.resultado).toBe(
      "Debes seleccionar una evaluación del resultado"
    );
  });

  test("PU08 - debe acumular errores cuando faltan campo, acción y resultado", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [
          {
            label: "Volumen estimado",
          },
        ],
        campos: {
          "Volumen estimado": "",
        },
        accionSeleccionada: "",
        resultadoSeleccionado: "",
      });

    expect(result["Volumen estimado"]).toBeTruthy();
    expect(result.accion).toBeTruthy();
    expect(result.resultado).toBeTruthy();
  });

  test("PU09 - debe tratar como vacío un campo obligatorio no presente en el objeto campos", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [
          {
            label: "Profundidad del bache",
          },
        ],
        campos: {},
        accionSeleccionada: "Señalización realizada",
        resultadoSeleccionado: "Atención parcial",
      });

    expect(result["Profundidad del bache"]).toBe(
      "Este campo es obligatorio"
    );
  });

  test("PU10 - debe aceptar atención sin campos obligatorios cuando acción y resultado están seleccionados", () => {
    const result =
      validateTechnicianAttention({
        camposObligatorios: [],
        campos: {},
        accionSeleccionada: "Inspección realizada",
        resultadoSeleccionado: "Atención completada",
      });

    expect(result).toEqual({});
  });
});