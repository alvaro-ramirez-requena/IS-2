import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const error = err as any;

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  if (error?.code === "P2002") {
    return res.status(409).json({
      message: "Ya existe un registro con ese dato único",
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Error interno del servidor",
  });
}