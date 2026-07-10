import { Request, Response } from "express";
import { chatWithGemini } from "../services/chatbot.service";

export class ChatbotController {

  // POST /api/chatbot/message
  static async sendMessage(req: Request, res: Response) {
    try {
      const { message, history, role, page, pageId } = req.body;

      if (!message || message.trim() === "") {
        return res.status(400).json({ message: "El mensaje no puede estar vacío" });
      }

      const reply = await chatWithGemini(
        message,
        history || [],
        role || "CITIZEN",
        page || "home",
        pageId
      );

      return res.json({ reply });

    } catch (error: any) {
      console.error("Chatbot error:", error);
      return res.status(500).json({ message: "Error al procesar el mensaje" });
    }
  }
}
