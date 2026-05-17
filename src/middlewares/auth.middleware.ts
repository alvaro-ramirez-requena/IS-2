import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import { verifyToken } from "../utils/token";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new HttpError(401, "No autenticado");
    }

    const payload = verifyToken(header.slice(7));

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      districtId: payload.districtId ?? null,
    };

    next();
  } catch {
    next(new HttpError(401, "Token inválido o expirado"));
  }
}