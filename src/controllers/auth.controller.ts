import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, email, password, districtId } = req.body;

    if (!firstName || !lastName || !email || !password) {
      throw new HttpError(400, "Faltan campos obligatorios");
    }

    const result = await authService.register({
      firstName,
      lastName,
      email,
      password,
      districtId,
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new HttpError(400, "Email y contraseña son obligatorios");
    }

    const result = await authService.login({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new HttpError(401, "No autenticado");
    }

    const user = await authService.me(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}