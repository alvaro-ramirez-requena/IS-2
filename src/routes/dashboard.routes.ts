import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  categoriesRows,
  districts,
  summary,
  topProblems,
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/summary", authMiddleware, summary);
router.get("/top-problems", authMiddleware, topProblems);
router.get("/categories", authMiddleware, categoriesRows);
router.get("/districts", districts);

export default router;