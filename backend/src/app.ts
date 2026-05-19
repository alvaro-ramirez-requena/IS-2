import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes"
import reportRoutes from "./routes/report.routes"

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("API ReportaYA funcionando");
});

export default app;