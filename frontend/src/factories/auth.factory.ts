import type {
  RegisterFormValues,
  RegisterDTO,
} from "../types/auth.types";

export class AuthFactory {

  static toRegisterDTO(
    formData: RegisterFormValues
  ): RegisterDTO {

    return {
      firstName:
        formData.firstName.trim(),

      lastName:
        formData.lastName.trim(),

      email:
        formData.email.trim(),

      password:
        formData.password,
    };
  }
}