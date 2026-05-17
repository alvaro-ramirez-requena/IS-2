import { NextFunction, Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import { HttpError } from "../utils/httpError";

export async function summary(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "No autenticado");

    const districtId = await dashboardService.resolveDistrictId(
      req.user.districtId,
      typeof req.query.districtId === "string" ? req.query.districtId : undefined
    );

    const data = await dashboardService.getSummary(districtId);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function topProblems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw new HttpError(401, "No autenticado");

    const districtId = await dashboardService.resolveDistrictId(
      req.user.districtId,
      typeof req.query.districtId === "string" ? req.query.districtId : undefined
    );

    const data = await dashboardService.getTopProblems(districtId);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function categoriesRows(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw new HttpError(401, "No autenticado");

    const districtId = await dashboardService.resolveDistrictId(
      req.user.districtId,
      typeof req.query.districtId === "string" ? req.query.districtId : undefined
    );

    const data = await dashboardService.getCategoriesRows(districtId);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function districts(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.listDistricts();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}