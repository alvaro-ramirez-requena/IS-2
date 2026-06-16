import { Request, Response } from "express";
import { FieldWorkService } from "../services/fieldwork.service";
import { EvidencePhase } from "@prisma/client";
import fs from "fs";

const fieldWorkService = new FieldWorkService();

export class FieldWorkController {

  // POST /api/fieldwork/:reportId/start
  // Inicia el registro de trabajo de campo
  static async start(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const { technicianId } = req.body;

      if (!technicianId) {
        return res.status(400).json({ message: "technicianId es requerido" });
      }

      const fieldWork = await fieldWorkService.startFieldWork(reportId, technicianId);
      return res.status(201).json(fieldWork);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // PATCH /api/fieldwork/:reportId/arrive
  // Registra hora de llegada y valida ubicación del técnico
  static async registerArrival(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const { latitude, longitude } = req.body;

      const result = await fieldWorkService.registerArrival(
        reportId,
        latitude,
        longitude
      );

      // Informa si el técnico está lejos del punto reportado
      const response: any = { ...result };
      if (result.distanceMeters !== null && result.distanceMeters !== undefined) {
        response.locationWarning =
          result.distanceMeters > 200
            ? `Estás a ${Math.round(result.distanceMeters)} metros del punto reportado`
            : null;
      }

      return res.json(response);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // PATCH /api/fieldwork/:reportId/notes
  // Guarda o actualiza las notas del técnico
  static async saveNotes(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const { notes } = req.body;

      if (!notes || notes.trim() === "") {
        return res.status(400).json({ message: "Las notas no pueden estar vacías" });
      }

      const result = await fieldWorkService.saveNotes(reportId, notes);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // PATCH /api/fieldwork/:reportId/close
  // Registra hora de cierre del trabajo
  static async registerClosure(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const result = await fieldWorkService.registerClosure(reportId);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // POST /api/fieldwork/:reportId/evidence
  // Sube foto antes o después (reutiliza Cloudinary de US07)
  static async addEvidence(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const { phase } = req.body; // "BEFORE" | "AFTER"
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Imagen requerida" });
      }

      if (!phase || !["BEFORE", "AFTER"].includes(phase)) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({ message: "phase debe ser BEFORE o AFTER" });
      }

      const result = await fieldWorkService.addEvidence(
        reportId,
        file.path,
        phase as EvidencePhase
      );

      // Limpia el archivo temporal igual que en US07
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

      return res.status(201).json(result);
    } catch (error: any) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: error.message });
    }
  }

  // DELETE /api/fieldwork/evidence/:evidenceId
  // Elimina una evidencia específica
  static async removeEvidence(req: Request, res: Response) {
    try {
      const { evidenceId } = req.params;
      await fieldWorkService.removeEvidence(evidenceId);
      return res.json({ message: "Evidencia eliminada correctamente" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // GET /api/fieldwork/:reportId
  // Obtiene el estado completo del trabajo de campo
  static async getFieldWork(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const result = await fieldWorkService.getFieldWork(reportId);
      return res.json(result);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}