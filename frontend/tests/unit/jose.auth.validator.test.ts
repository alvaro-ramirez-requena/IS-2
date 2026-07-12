import {
  describe,
  expect,
  test,
} from "vitest";

import {
  validateRegister,
} from "../../src/validators/auth.validator";

describe("Pruebas unitarias de Jose Gonzalo Paz Peña - HU25 Validacion de seguridad de contraseña", () => {
  test("PU01 - debe aceptar un registro con datos válidos", () => {
    const result =
      validateRegister({
        firstName: "Gonzalo",
        lastName: "Paz",
        email: "gpaz0462@gmail.com",
        password: "Gonzalo123!",
      });

    expect(result).toEqual({});
  });

  test("PU02 - debe rechazar el registro cuando el nombre está vacío", () => {
    const result =
      validateRegister({
        firstName: "",
        lastName: "Paz",
        email: "gpaz0462@gmail.com",
        password: "Gonzalo123!",
      });

    expect(result.firstName).toBeTruthy();
  });

  test("PU03 - debe rechazar el registro cuando el apellido está vacío", () => {
    const result =
      validateRegister({
        firstName: "Gonzalo",
        lastName: "",
        email: "gpaz0462@gmail.com",
        password: "Gonzalo123!",
      });

    expect(result.lastName).toBeTruthy();
  });

  test("PU04 - debe rechazar el registro cuando el correo está vacío", () => {
    const result =
      validateRegister({
        firstName: "Gonzalo",
        lastName: "Paz",
        email: "",
        password: "Gonzalo123!",
      });

    expect(result.email).toBeTruthy();
  });

  test("PU05 - debe rechazar el registro cuando el correo tiene formato inválido", () => {
    const result =
      validateRegister({
        firstName: "Gonzalo",
        lastName: "Paz",
        email: "gpaz0462gmail.com",
        password: "Gonzalo123!",
      });

    expect(result.email).toBeTruthy();
  });

  test("PU06 - debe rechazar el registro cuando la contraseña está vacía", () => {
    const result =
      validateRegister({
        firstName: "Gonzalo",
        lastName: "Paz",
        email: "gpaz0462@gmail.com",
        password: "",
      });

    expect(result.password).toBeTruthy();
  });

  test("PU07 - debe rechazar contraseña sin mayúscula", () => {
    const result =
      validateRegister({
        firstName: "Gonzalo",
        lastName: "Paz",
        email: "gpaz0462@gmail.com",
        password: "gonzalo123!",
      });

    expect(result.password).toBeTruthy();
  });

  test("PU08 - debe rechazar contraseña sin minúscula", () => {
    const result =
      validateRegister({
        firstName: "Gonzalo",
        lastName: "Paz",
        email: "gpaz0462@gmail.com",
        password: "GONZALO123!",
      });

    expect(result.password).toBeTruthy();
  });

  test("PU09 - debe rechazar contraseña sin número", () => {
    const result =
      validateRegister({
        firstName: "Gonzalo",
        lastName: "Paz",
        email: "gpaz0462@gmail.com",
        password: "GonzaloPaz!",
      });

    expect(result.password).toBeTruthy();
  });

  test("PU10 - debe rechazar contraseña sin carácter especial", () => {
    const result =
      validateRegister({
        firstName: "Gonzalo",
        lastName: "Paz",
        email: "gpaz0462@gmail.com",
        password: "Gonzalo123",
      });

    expect(result.password).toBeTruthy();
  });
});