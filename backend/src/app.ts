import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import reportRoutes from "./routes/report.routes";
import uploadRoutes from "./routes/upload.routes";
import fieldWorkRoutes from "./routes/fieldwork.routes";
import chatbotRoutes from "./routes/chatbot.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/fieldwork", fieldWorkRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("API ReportaYA funcionando");
});

export default app;