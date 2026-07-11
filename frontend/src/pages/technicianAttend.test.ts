import { describe, it, expect } from "vitest";
import { validarAtencion } from "./technicianAttend.utils";

const camposPersonasSospechosas = [
    { label: "Descripción de las personas", placeholder: "", descripcion: "", minLength: 5 },
    { label: "Tiempo en el lugar", placeholder: "", descripcion: "" },
    { label: "Observaciones adicionales", placeholder: "", descripcion: "" },
];

describe("validarAtencion — US17 Atención técnica", () => {

    it("Caso 1: todo correcto → no genera errores", () => {
        const campos = {
            "Descripción de las personas": "2 personas con capucha rondando el área",
            "Tiempo en el lugar": "Aproximadamente 1 hora",
            "Observaciones adicionales": "N/A",
        };
        const errores = validarAtencion(camposPersonasSospechosas, campos, "Reparación", "Aparentemente resuelto");
        expect(errores).toEqual({});
    });

    it("Caso 2: campo obligatorio vacío → marca 'obligatorio'", () => {
        const campos = {
            "Descripción de las personas": "",
            "Tiempo en el lugar": "1 hora",
            "Observaciones adicionales": "N/A",
        };
        const errores = validarAtencion(camposPersonasSospechosas, campos, "Reparación", "Aparentemente resuelto");
        expect(errores["Descripción de las personas"]).toBe("Este campo es obligatorio");
    });

    it("Caso 3: campo con longitud menor al mínimo → marca 'muy corto'", () => {
        const campos = {
            "Descripción de las personas": "Sr",
            "Tiempo en el lugar": "1 hora",
            "Observaciones adicionales": "N/A",
        };
        const errores = validarAtencion(camposPersonasSospechosas, campos, "Reparación", "Aparentemente resuelto");
        expect(errores["Descripción de las personas"]).toBe("Debe tener al menos 5 caracteres");
    });

    it("Caso 4: sin acción seleccionada → marca error en 'accion'", () => {
        const campos = {
            "Descripción de las personas": "2 personas con capucha rondando el área",
            "Tiempo en el lugar": "1 hora",
            "Observaciones adicionales": "N/A",
        };
        const errores = validarAtencion(camposPersonasSospechosas, campos, "", "Aparentemente resuelto");
        expect(errores["accion"]).toBe("Debes seleccionar una acción realizada");
    });

    it("Caso 5: sin resultado seleccionado → marca error en 'resultado'", () => {
        const campos = {
            "Descripción de las personas": "2 personas con capucha rondando el área",
            "Tiempo en el lugar": "1 hora",
            "Observaciones adicionales": "N/A",
        };
        const errores = validarAtencion(camposPersonasSospechosas, campos, "Reparación", "");
        expect(errores["resultado"]).toBe("Debes seleccionar una evaluación del resultado");
    });

    it("Caso 6: campo sin minLength acepta texto corto como 'N/A'", () => {
        const campos = {
            "Descripción de las personas": "2 personas con capucha rondando el área",
            "Tiempo en el lugar": "1h",
            "Observaciones adicionales": "N/A",
        };
        const errores = validarAtencion(camposPersonasSospechosas, campos, "Reparación", "Aparentemente resuelto");
        expect(errores["Tiempo en el lugar"]).toBeUndefined();
        expect(errores["Observaciones adicionales"]).toBeUndefined();
    });

});
