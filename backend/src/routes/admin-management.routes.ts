import {
  Router,
} from "express";

import {
  AdminManagementController,
} from "../controllers/admin-management.controller";

const router =
  Router();

router.get(
  "/municipalities",
  AdminManagementController.getMunicipalities
);

router.post(
  "/municipalities",
  AdminManagementController.createMunicipality
);

router.get(
  "/operators",
  AdminManagementController.getOperators
);

router.post(
  "/operators",
  AdminManagementController.createOperator
);

export default router;