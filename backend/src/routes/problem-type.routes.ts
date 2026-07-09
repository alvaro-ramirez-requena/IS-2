import { Router } from "express";
import { ProblemTypeController } from "../controllers/problem-type.controller";

const router = Router();

router.get(
  "/",
  ProblemTypeController.getAll
);

router.get(
  "/:id",
  ProblemTypeController.getById
);

router.post(
  "/",
  ProblemTypeController.create
);

router.put(
  "/:id",
  ProblemTypeController.update
);

router.delete(
  "/:id",
  ProblemTypeController.delete
);

export default router;