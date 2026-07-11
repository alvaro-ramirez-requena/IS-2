import {
  Request,
  Response,
} from "express";

import {
  AdminManagementService,
} from "../services/admin-management.service";

const adminManagementService =
  new AdminManagementService();

export class AdminManagementController {
  static async getMunicipalities(
    req: Request,
    res: Response
  ) {
    try {
      const municipalities =
        await adminManagementService.getMunicipalities();

      return res.json(municipalities);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al obtener municipalidades.",
      });
    }
  }

  static async createMunicipality(
    req: Request,
    res: Response
  ) {
    try {
      const municipality =
        await adminManagementService.createMunicipality({
          name:
            req.body.name,

          district:
            req.body.district,

          province:
            req.body.province,

          department:
            req.body.department,
        });

      return res.status(201).json(municipality);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al crear municipalidad.",
      });
    }
  }

  static async getOperators(
    req: Request,
    res: Response
  ) {
    try {
      const operators =
        await adminManagementService.getOperators();

      return res.json(operators);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al obtener operadores.",
      });
    }
  }

  static async createOperator(
    req: Request,
    res: Response
  ) {
    try {
      const operator =
        await adminManagementService.createOperator({
          firstName:
            req.body.firstName,

          lastName:
            req.body.lastName,

          email:
            req.body.email,

          password:
            req.body.password,

          municipalityId:
            req.body.municipalityId,
        });

      return res.status(201).json(operator);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al crear operador.",
      });
    }
  }
}