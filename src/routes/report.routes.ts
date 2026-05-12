import { Router } from "express";
import { ReportController } from "../controllers/report.controller";

const router = Router();

router.post("/", ReportController.create);
router.get("/user/:userId", ReportController.getByUser);
router.get("/:id", ReportController.getById);

export default router;