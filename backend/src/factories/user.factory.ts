import { Role } from "@prisma/client";

type CreateUserDTO = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: Role;
};

export class UserFactory {
  static create(data: CreateUserDTO) {
    return {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      role: data.role ?? Role.CITIZEN,
    };
  }
}