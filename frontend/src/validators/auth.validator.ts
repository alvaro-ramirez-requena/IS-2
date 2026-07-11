import type { RegisterFormValues, LoginFormValues } from "../types/auth.types";

export const validateRegister = (values: RegisterFormValues) => {
  const errors: Partial<Record<keyof RegisterFormValues, string>> = {};

  if (!values.firstName.trim()) {
    errors.firstName = "El nombre es obligatorio";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "El apellido es obligatorio";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email.trim()) {
    errors.email = "El correo es obligatorio";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "El correo tiene un formato inválido";
  }

  if (!values.password.trim()) {
    errors.password = "La contraseña es obligatoria";
  } else {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(values.password)) {
      errors.password =
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    }
  }

  return errors;
};

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
