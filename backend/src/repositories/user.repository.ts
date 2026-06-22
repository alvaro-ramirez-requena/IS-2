import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";

type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role;
};

export class UserRepository {
  async create(data: CreateUserInput) {
    return await prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByRole(role: Role) {
    return await prisma.user.findMany({
      where: { role },
    });
  }

  async updateAvailability(
    userId: string,
    availability: boolean
  ) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        availability,
      },
    });
  }
}