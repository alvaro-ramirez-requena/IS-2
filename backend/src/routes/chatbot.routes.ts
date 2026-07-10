import { Router } from "express";
import { ChatbotController } from "../controllers/chatbot.controller";

const router = Router();

// POST /api/chatbot/message
router.post("/message", ChatbotController.sendMessage);

export default router;
