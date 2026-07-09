import { Request, Response } from "express";
import { ProblemTypeService } from "../services/problem-type.service";

const problemTypeService =
  new ProblemTypeService();

export class ProblemTypeController {

  static async getAll(
    req: Request,
    res: Response
  ) {
    try {

      const problemTypes =
        await problemTypeService.getAll();

      res.json(problemTypes);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  static async getById(
    req: Request,
    res: Response
  ) {
    try {

      const id =
        req.params.id as string;

      const problemType =
        await problemTypeService.getById(
          id
        );

      res.json(problemType);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  static async create(
    req: Request,
    res: Response
  ) {
    try {

      const problemType =
        await problemTypeService.create(
          req.body
        );

      res.status(201).json(problemType);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  static async update(
    req: Request,
    res: Response
  ) {
    try {

      const id =
        req.params.id as string;

      const problemType =
        await problemTypeService.update(
          id,
          req.body
        );

      res.json(problemType);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  static async delete(
    req: Request,
    res: Response
  ) {
    try {

      const id =
        req.params.id as string;

      await problemTypeService.delete(
        id
      );

      res.json({
        message:
          "Tipo de problema eliminado correctamente",
      });

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

}