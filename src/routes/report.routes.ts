import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  create,
  getById,
  getByUser,
  mine,
} from "../controllers/report.controller";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/mine", authMiddleware, mine);
router.get("/user/:userId", authMiddleware, getByUser);
router.get("/:id", authMiddleware, getById);

export default router;