import type {
  RegisterFormValues, LoginFormValues
} from "../types/auth.types";

export const validateRegister = (
  values: RegisterFormValues
) => {

  const errors:
    Partial<
      Record<
        keyof RegisterFormValues,
        string
      >
    > = {};

  if (!values.firstName.trim()) {
    errors.firstName =
      "El nombre es obligatorio";
  }

  if (!values.lastName.trim()) {
    errors.lastName =
      "El apellido es obligatorio";
  }

  if (!values.email.trim()) {
    errors.email =
      "El correo es obligatorio";
  }

  if (!values.password.trim()) {
    errors.password =
      "La contraseña es obligatoria";
  }

  return errors;
};

export const validateLogin = (
  values: LoginFormValues
) => {

  const errors:
    Partial<
      Record<
        keyof LoginFormValues,
        string
      >
    > = {};

  if (!values.email.trim()) {
    errors.email =
      "El correo es obligatorio";
  }

  if (!values.password.trim()) {
    errors.password =
      "La contraseña es obligatoria";
  }

  return errors;
};