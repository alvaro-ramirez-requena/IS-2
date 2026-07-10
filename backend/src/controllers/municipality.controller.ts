import { Request, Response } from "express";
import { MunicipalityRepository } from "../repositories/municipality.repository";

const municipalityRepository =
  new MunicipalityRepository();

export class MunicipalityController {
  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const municipalities =
        await municipalityRepository.findAll();

      res.json(municipalities);

    } catch (error: any) {
      res.status(500).json({
        message:
          error.message ||
          "Error al obtener municipalidades.",
      });
    }
  }
}