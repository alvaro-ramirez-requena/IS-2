import { Router } from "express";
import { FieldWorkController } from "../controllers/fieldwork.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Iniciar trabajo de campo para un reporte
router.post("/:reportId/start", FieldWorkController.start);

// Registrar llegada + validar ubicación GPS
router.patch("/:reportId/arrive", FieldWorkController.registerArrival);

// Guardar notas del técnico
router.patch("/:reportId/notes", FieldWorkController.saveNotes);

// Registrar hora de cierre
router.patch("/:reportId/close", FieldWorkController.registerClosure);

// Subir foto antes o después (reutiliza el middleware de multer de US07)
router.post(
  "/:reportId/evidence",
  upload.single("image"),
  FieldWorkController.addEvidence
);

// Eliminar una evidencia
router.delete("/evidence/:evidenceId", FieldWorkController.removeEvidence);

// Obtener estado completo del trabajo de campo
router.get("/:reportId", FieldWorkController.getFieldWork);

export default router;