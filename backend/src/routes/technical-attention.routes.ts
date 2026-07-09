import { Router } from "express";
import { TechnicalAttentionController } from "../controllers/technical-attention.controller";

const router =
  Router();

router.post(
  "/",
  TechnicalAttentionController.create
);

router.get(
  "/report/:reportId",
  TechnicalAttentionController.getByReport
);

router.get(
  "/report/:reportId/latest",
  TechnicalAttentionController.getLatestByReport
);

export default router;