import {
  Router,
} from "express";

import {
  ReportRetentionController,
} from "../controllers/report-retention.controller";

const router =
  Router();

router.get(
  "/",
  ReportRetentionController.getConfiguration
);

router.put(
  "/",
  ReportRetentionController.updateConfiguration
);

export default router;