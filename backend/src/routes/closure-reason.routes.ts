import { Router } from "express";
import { ClosureReasonController } from "../controllers/closure-reason.controller";

const router = Router();

router.get(
  "/",
  ClosureReasonController.getAll
);

router.get(
  "/:id",
  ClosureReasonController.getById
);

router.post(
  "/",
  ClosureReasonController.create
);

router.put(
  "/:id",
  ClosureReasonController.update
);

router.delete(
  "/:id",
  ClosureReasonController.delete
);

export default router;