import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";

type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role;

  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
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
      where: {
        id,
      },
      include: {
        municipality: true,
      },
    });
  }

  async findByVerificationToken(hashedToken: string) {
    return await prisma.user.findFirst({
      where: {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async verifyEmail(userId: string) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });
  }
  async updateVerificationToken(userId: string, hashedToken: string, expiresAt: Date) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: expiresAt,
        emailVerified: false,
      },
    });
  }
  async updatePasswordResetToken(userId: string, hashedToken: string, expiresAt: Date) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
      },
    });
  }

  async findByPasswordResetToken(hashedToken: string) {
    return await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }

  async findByRole(role: Role) {
    return await prisma.user.findMany({
      where: { role },
    });
  }

  async updateAvailability(userId: string, availability: boolean) {
    return await prisma.technicianProfile.upsert({
      where: {
        userId,
      },
      update: {
        available: availability,
      },
      create: {
        userId,
        available: availability,
        skills: [],
      },
    });
  }
}
