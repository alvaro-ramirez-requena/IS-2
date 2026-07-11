import { Router } from "express";
import { AIController } from "../controllers/ai.controller";

const router = Router();

// Analizar reporte (clasificación + priorización + duplicados)
router.get("/analyze/:reportId", AIController.analyzeReport);

// Alertas por retrasos
router.get("/delays", AIController.getDelayedReports);

export default router;
