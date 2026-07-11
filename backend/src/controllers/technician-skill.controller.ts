import {
  Request,
  Response,
} from "express";

import {
  TechnicianSkillService,
} from "../services/technician-skill.service";

const technicianSkillService =
  new TechnicianSkillService();

export class TechnicianSkillController {
  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const skills =
        await technicianSkillService.getAll();

      return res.json(skills);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al obtener habilidades técnicas.",
      });
    }
  }

  static async getActive(
    req: Request,
    res: Response
  ) {
    try {
      const skills =
        await technicianSkillService.getActive();

      return res.json(skills);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al obtener habilidades técnicas activas.",
      });
    }
  }

  static async create(
    req: Request,
    res: Response
  ) {
    try {
      const skill =
        await technicianSkillService.create({
          name:
            req.body.name,

          description:
            req.body.description,
        });

      return res.status(201).json(skill);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al crear habilidad técnica.",
      });
    }
  }

  static async update(
    req: Request,
    res: Response
  ) {
    try {
      const skill =
        await technicianSkillService.update(
          String(req.params.id),
          {
            name:
              req.body.name,

            description:
              req.body.description,

            active:
              req.body.active,
          }
        );

      return res.json(skill);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al actualizar habilidad técnica.",
      });
    }
  }

  static async activate(
    req: Request,
    res: Response
  ) {
    try {
      const skill =
        await technicianSkillService.activate(
          String(req.params.id)
        );

      return res.json(skill);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al activar habilidad técnica.",
      });
    }
  }

  static async deactivate(
    req: Request,
    res: Response
  ) {
    try {
      const skill =
        await technicianSkillService.deactivate(
          String(req.params.id)
        );

      return res.json(skill);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al desactivar habilidad técnica.",
      });
    }
  }
}