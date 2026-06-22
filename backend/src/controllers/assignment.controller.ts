import { Request, Response } from "express";
import { AssignmentService } from "../services/assignment.service";

const assignmentService =
  new AssignmentService();

export class AssignmentController {
  static async getTechnicians(
    req: Request,
    res: Response
  ) {
    try {

      const filters = {
        zone:
          req.query.zone as string,

        specialty:
          req.query.specialty as string,

        availability:
          req.query.availability ===
            "true"
            ? true
            : req.query.availability ===
              "false"
              ? false
              : undefined,
      };

      const technicians =
        await assignmentService
          .getTechnicians(filters);

      res.json(technicians);

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getAssignmentsByReport(
    req: Request,
    res: Response
  ) {
    try {

      const reportId =
        req.params.reportId as string;

      const assignments =
        await assignmentService
          .getAssignmentsByReport(
            reportId
          );

      res.json(assignments);

    } catch (error: any) {

      res.status(400).json({
        message:
          error.message,
      });
    }
  }

  static async reassignReport(
    req: Request,
    res: Response
  ) {
    try {

      const assignment =
        await assignmentService
          .reassignReport(
            req.body
          );

      res.json(assignment);

    } catch (error: any) {
      res.status(400).json({
        message:
          error.message,
      });
    }
  }

  static async assignReport(
    req: Request,
    res: Response
  ) {
    try {
      const assignment =
        await assignmentService.assignReport(
          req.body
        );

      res.status(201).json(assignment);

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}