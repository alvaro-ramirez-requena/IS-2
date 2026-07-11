import { Router } from "express";
import { MunicipalityController } from "../controllers/municipality.controller";

const router = Router();

router.get("/", MunicipalityController.getAll);

export default router;
