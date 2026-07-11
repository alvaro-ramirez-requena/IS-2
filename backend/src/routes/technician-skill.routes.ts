import {
  Router,
} from "express";

import {
  TechnicianSkillController,
} from "../controllers/technician-skill.controller";

const router =
  Router();

router.get(
  "/",
  TechnicianSkillController.getAll
);

router.get(
  "/active",
  TechnicianSkillController.getActive
);

router.post(
  "/",
  TechnicianSkillController.create
);

router.patch(
  "/:id",
  TechnicianSkillController.update
);

router.patch(
  "/:id/activate",
  TechnicianSkillController.activate
);

router.patch(
  "/:id/deactivate",
  TechnicianSkillController.deactivate
);

export default router;