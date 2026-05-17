import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";

export function roleMiddleware(allowedRoles: Array<"CITIZEN" | "OPERATOR" | "TECHNICIAN">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "No autenticado"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpError(403, "No tienes permisos para esta acción"));
    }

    next();
  };
}