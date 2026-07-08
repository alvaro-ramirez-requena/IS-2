import { Request, Response } from "express";
import { TechnicianApplicationService } from "../services/technician-application.service";

const technicianApplicationService =
  new TechnicianApplicationService();

export class TechnicianApplicationController {

  async create(req: Request, res: Response) {
    try {
      const application =
        await technicianApplicationService.createApplication({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          dni: req.body.dni,
          district: req.body.district,
          skills: req.body.skills || [],
          experience: req.body.experience,
        });

      return res.status(201).json(application);

    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Error al registrar postulación.",
      });
    }
  }

  async getPending(req: Request, res: Response) {
    try {
      const applications =
        await technicianApplicationService.getPendingApplications();

      return res.json(applications);

    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error al obtener postulaciones.",
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const applications =
        await technicianApplicationService.getAllApplications();

      return res.json(applications);

    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error al obtener postulaciones.",
      });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const applicationId =
        String(req.params.id);

      const reviewedById =
        req.body.reviewedById;

      const result =
        await technicianApplicationService.approveApplication(
          applicationId,
          reviewedById
        );

      return res.json({
        message: "Postulación aprobada. Técnico creado correctamente.",
        ...result,
      });

    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Error al aprobar postulación.",
      });
    }
  }

  async reject(req: Request, res: Response) {
    try {
      const applicationId =
        String(req.params.id);

      const reviewedById =
        req.body.reviewedById;

      const application =
        await technicianApplicationService.rejectApplication(
          applicationId,
          reviewedById
        );

      return res.json({
        message: "Postulación rechazada correctamente.",
        application,
      });

    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Error al rechazar postulación.",
      });
    }
  }
}