import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import reportRoutes from "./routes/report.routes";
import uploadRoutes from "./routes/upload.routes";
import reportFollowRoutes from "./routes/report-follow.routes";
import notificationRoutes from "./routes/notification.routes";
import technicianApplicationRoutes from "./routes/technician-application.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/report-follows", reportFollowRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/technician-applications", technicianApplicationRoutes);

app.get("/", (req, res) => {
  res.send("API ReportaYA funcionando");
});

export default app;