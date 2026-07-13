export type RequiredAttentionField = {
  label: string;
  minLength?: number;
};

export type TechnicianAttentionValidationInput = {
  camposObligatorios: RequiredAttentionField[];
  campos: Record<string, string>;
  accionSeleccionada?: string | null;
  resultadoSeleccionado?: string | null;
};

export function validateTechnicianAttention({
  camposObligatorios,
  campos,
  accionSeleccionada,
  resultadoSeleccionado,
}: TechnicianAttentionValidationInput): Record<string, string> {
  const nuevosErrores: Record<string, string> = {};

  camposObligatorios.forEach((campo) => {
    const valor = campos[campo.label] ?? "";

    if (valor.trim() === "") {
      nuevosErrores[campo.label] = "Este campo es obligatorio";
    } else if (
      campo.minLength &&
      valor.trim().length < campo.minLength
    ) {
      nuevosErrores[campo.label] =
        `Debe tener al menos ${campo.minLength} caracteres`;
    }
  });

  if (!accionSeleccionada) {
    nuevosErrores.accion =
      "Debes seleccionar una acción realizada";
  }

  if (!resultadoSeleccionado) {
    nuevosErrores.resultado =
      "Debes seleccionar una evaluación del resultado";
  }

  return nuevosErrores;
}