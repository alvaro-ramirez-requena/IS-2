import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import reportRoutes from "./routes/report.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (_req, res) => {
  res.send("API ReportaYA funcionando");
});

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorMiddleware);

export default app;