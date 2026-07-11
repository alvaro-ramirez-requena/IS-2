import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";

const router = Router();

router.get("/user/:userId", NotificationController.getByUser);

router.patch("/:id/read", NotificationController.markAsRead);

router.patch("/user/:userId/read-all", NotificationController.markAllAsRead);

export default router;
