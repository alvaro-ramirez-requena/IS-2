import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes"
import reportRoutes from "./routes/report.routes"
import uploadRoutes
from "./routes/upload.routes"
import assignmentRoutes
from "./routes/assignment.routes";
import categoryRoutes
from "./routes/category.routes";
import problemTypeRoutes
from "./routes/problem-type.routes";
import closureReasonRoutes
from "./routes/closure-reason.routes";
import slaConfigurationRoutes
from "./routes/sla-configuration.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use(
  "/api/assignments",
  assignmentRoutes
);
app.use(
  "/api/categories",
  categoryRoutes
);
app.use(
  "/api/problem-types",
  problemTypeRoutes
);

app.use(
  "/api/closure-reasons",
  closureReasonRoutes
);

app.use(
  "/api/sla-configurations",
  slaConfigurationRoutes
);

app.use(
  "/api/uploads",
  uploadRoutes
);

app.get("/", (req, res) => {
  res.send("API ReportaYA funcionando");
});

export default app;