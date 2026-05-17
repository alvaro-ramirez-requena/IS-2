import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import * as reportService from "../services/report.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "No autenticado");

    const {
      title,
      description,
      location,
      categoryId,
      districtId,
      isAnonymous,
      latitude,
      longitude,
      evidenceUrl,
      severity,
      urgency,
    } = req.body;

    if (!title || !description || !location || !categoryId) {
      throw new HttpError(400, "Faltan campos obligatorios");
    }

    const finalDistrictId = districtId || req.user.districtId;

    if (!finalDistrictId) {
      throw new HttpError(400, "Debes indicar un distrito");
    }

    const report = await reportService.createReport(req.user.id, {
      title,
      description,
      location,
      categoryId,
      districtId: finalDistrictId,
      isAnonymous,
      latitude: latitude !== undefined ? Number(latitude) : undefined,
      longitude: longitude !== undefined ? Number(longitude) : undefined,
      evidenceUrl,
      severity: severity !== undefined ? Number(severity) : undefined,
      urgency: urgency !== undefined ? Number(urgency) : undefined,
    });

    return res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}

export async function mine(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "No autenticado");

    const reports = await reportService.listReportsByUser(req.user.id);
    return res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
}

export async function getByUser(
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw new HttpError(401, "No autenticado");

    const { userId } = req.params;

    if (req.user.role === "CITIZEN" && req.user.id !== userId) {
      throw new HttpError(403, "No puedes ver los reportes de otro usuario");
    }

    const reports = await reportService.listReportsByUser(userId);
    return res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
}

export async function getById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw new HttpError(401, "No autenticado");

    const { id } = req.params;
    const report = await reportService.getReportById(id, req.user.id, req.user.role);

    return res.status(200).json(report);
  } catch (error) {
    next(error);
  }
}