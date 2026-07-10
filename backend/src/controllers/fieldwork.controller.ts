import {
  Request,
  Response,
} from "express";

import {
  EvidencePhase,
} from "@prisma/client";

import {
  FieldWorkService,
} from "../services/fieldwork.service";

const fieldWorkService =
  new FieldWorkService();

export class FieldWorkController {
  static async getByReport(
    req: Request,
    res: Response
  ) {
    try {
      const reportId =
        String(req.params.reportId);

      const fieldWork =
        await fieldWorkService
          .getByReport(reportId);

      return res.json(fieldWork);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al obtener trazabilidad.",
      });
    }
  }

  static async start(
    req: Request,
    res: Response
  ) {
    try {
      const reportId =
        String(req.params.reportId);

      const technicianId =
        String(req.body.technicianId || "");

      const fieldWork =
        await fieldWorkService
          .startFieldWork({
            reportId,
            technicianId,
          });

      return res.status(201).json(fieldWork);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al iniciar trazabilidad.",
      });
    }
  }

  static async arrive(
    req: Request,
    res: Response
  ) {
    try {
      const reportId =
        String(req.params.reportId);

      const technicianId =
        String(req.body.technicianId || "");

      const arrivalLat =
        Number(req.body.arrivalLat);

      const arrivalLng =
        Number(req.body.arrivalLng);

      if (
        Number.isNaN(arrivalLat) ||
        Number.isNaN(arrivalLng)
      ) {
        return res.status(400).json({
          message:
            "La latitud y longitud de llegada son obligatorias.",
        });
      }

      const fieldWork =
        await fieldWorkService
          .registerArrival({
            reportId,
            technicianId,
            arrivalLat,
            arrivalLng,
          });

      return res.json(fieldWork);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al registrar llegada.",
      });
    }
  }

  static async saveNotes(
    req: Request,
    res: Response
  ) {
    try {
      const reportId =
        String(req.params.reportId);

      const notes =
        String(req.body.notes || "");

      const fieldWork =
        await fieldWorkService
          .saveNotes({
            reportId,
            notes,
          });

      return res.json(fieldWork);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al guardar notas.",
      });
    }
  }

  static async addEvidence(
    req: Request,
    res: Response
  ) {
    try {
      const reportId =
        String(req.params.reportId);

      const technicianId =
        String(req.body.technicianId || "");

      const imageUrl =
        String(req.body.imageUrl || "");

      const phase =
        req.body.phase as EvidencePhase;

      const fieldWork =
        await fieldWorkService
          .addEvidence({
            reportId,
            technicianId,
            imageUrl,
            phase,
          });

      return res.status(201).json(fieldWork);

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al registrar evidencia.",
      });
    }
  }

  static async close(
    req: Request,
    res: Response
  ) {
    try {
      const reportId =
        String(req.params.reportId);

      const fieldWork =
        await fieldWorkService
          .closeFieldWork(reportId);

      return res.json({
        message:
          "Trabajo de campo cerrado correctamente.",
        fieldWork,
      });

    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Error al cerrar trabajo de campo.",
      });
    }
  }
  static async deleteEvidence(
    req: Request,
    res: Response
    ) {
    try {
        const evidenceId =
        String(req.params.evidenceId);

        const fieldWork =
        await fieldWorkService
            .deleteEvidence(evidenceId);

        return res.json(fieldWork);

    } catch (error: any) {
        return res.status(400).json({
        message:
            error.message ||
            "Error al eliminar evidencia.",
        });
    }
    }
}