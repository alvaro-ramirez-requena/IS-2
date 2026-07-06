import { Router } from "express";
import { SlaConfigurationController } from "../controllers/sla-configuration.controller";

const router = Router();

router.get(
  "/",
  SlaConfigurationController.getAll
);

router.get(
  "/priority/:priority",
  SlaConfigurationController.getByPriority
);

router.get(
  "/:id",
  SlaConfigurationController.getById
);

router.put(
  "/:id",
  SlaConfigurationController.update
);

export default router;