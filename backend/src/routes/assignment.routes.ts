import { Router } from "express";
import { AssignmentController } from "../controllers/assignment.controller";

const router = Router();

router.get(
  "/technicians",
  AssignmentController.getTechnicians
);

router.get(
  "/report/:reportId",
  AssignmentController.getAssignmentsByReport
);

router.put(
  "/reassign",
  AssignmentController.reassignReport
);

router.post(
  "/",
  AssignmentController.assignReport
);

export default router;