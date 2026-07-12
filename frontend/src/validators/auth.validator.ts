import type { RegisterFormValues, LoginFormValues } from "../types/auth.types";

export type RegisterValidationErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;

export function validateRegister(
  values: RegisterFormValues
) {
  const errors: RegisterValidationErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName =
      "El nombre es obligatorio.";
  }

  if (!values.lastName.trim()) {
    errors.lastName =
      "El apellido es obligatorio.";
  }

  if (!values.email.trim()) {
    errors.email =
      "El correo es obligatorio.";
  } else if (!emailRegex.test(values.email)) {
    errors.email =
      "El correo no tiene un formato válido.";
  }

  if (!values.password) {
    errors.password =
      "La contraseña es obligatoria.";
  } else if (!passwordRegex.test(values.password)) {
    errors.password =
      "La contraseña debe tener entre 8 y 20 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
  }

  return errors;
}

export const validateLogin = (values: LoginFormValues) => {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};

  if (!values.email.trim()) {
    errors.email = "El correo es obligatorio";
  }

  if (!values.password.trim()) {
    errors.password = "La contraseña es obligatoria";
  }

  return errors;
};
