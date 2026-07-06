import { Request, Response } from "express";
import { ClosureReasonService } from "../services/closure-reason.service";

const closureReasonService =
  new ClosureReasonService();

export class ClosureReasonController {

  static async getAll(
    req: Request,
    res: Response
  ) {
    try {

      const closureReasons =
        await closureReasonService.getAll();

      res.json(closureReasons);

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

      const closureReason =
        await closureReasonService.getById(id);

      res.json(closureReason);

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

      const closureReason =
        await closureReasonService.create(
          req.body
        );

      res.status(201).json(closureReason);

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

      const closureReason =
        await closureReasonService.update(
          id,
          req.body
        );

      res.json(closureReason);

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

      await closureReasonService.delete(id);

      res.json({
        message:
          "Motivo de cierre eliminado correctamente",
      });

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

}