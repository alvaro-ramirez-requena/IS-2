import { Router } from "express";

import { FieldWorkController } from "../controllers/fieldwork.controller";

const router = Router();

router.get("/:reportId", FieldWorkController.getByReport);

router.post("/:reportId/start", FieldWorkController.start);

router.patch("/:reportId/arrive", FieldWorkController.arrive);

router.patch("/:reportId/notes", FieldWorkController.saveNotes);

router.post("/:reportId/evidence", FieldWorkController.addEvidence);

router.delete("/evidence/:evidenceId", FieldWorkController.deleteEvidence);

router.patch("/:reportId/close", FieldWorkController.close);

export default router;
