import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";
import { comparePassword, hashPassword } from "../utils/password";
import { signToken } from "../utils/token";

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  districtId?: string | null;
};

type LoginInput = {
  email: string;
  password: string;
};

export async function register(data: RegisterInput) {
  const exists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (exists) {
    throw new HttpError(409, "El correo ya está registrado");
  }

  if (data.districtId) {
    const district = await prisma.district.findUnique({
      where: { id: data.districtId },
    });

    if (!district) {
      throw new HttpError(400, "Distrito inválido");
    }
  }

  const password = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password,
      role: "CITIZEN",
      districtId: data.districtId ?? null,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      districtId: true,
    },
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    districtId: user.districtId,
  });

  return { user, token };
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      role: true,
      districtId: true,
    },
  });

  if (!user) {
    throw new HttpError(401, "Credenciales incorrectas");
  }

  const valid = await comparePassword(data.password, user.password);

  if (!valid) {
    throw new HttpError(401, "Credenciales incorrectas");
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    districtId: user.districtId,
  });

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      districtId: user.districtId,
    },
  };
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      districtId: true,
      district: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      createdAt: true,
    },
  });

  if (!user) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  return user;
}