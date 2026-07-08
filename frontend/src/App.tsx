import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateReportPage from "./pages/CreateReportPage";
import ReportsByProblemPage from "./pages/ReportsByProblemPage";
import MyReportsPage from "./pages/MyReportsPage";
import OperatorDashboardPage from "./pages/OperatorDashboardPage";
import OperatorReportDetailPage from "./pages/OperatorReportDetailPage";
import TechnicianAttendPage from "./pages/TechnicianAttendPage";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/reports/create" element={<ProtectedRoute><CreateReportPage /></ProtectedRoute>} />
      <Route path="/reports/problem/:problemType" element={<ProtectedRoute><ReportsByProblemPage /></ProtectedRoute>} />
      <Route path="/my-reports" element={<ProtectedRoute><MyReportsPage /></ProtectedRoute>} />
      <Route path="/operator" element={<ProtectedRoute><OperatorDashboardPage /></ProtectedRoute>} />
      <Route path="/operator/report/:id" element={<ProtectedRoute><OperatorReportDetailPage /></ProtectedRoute>} />

      {/* US17 — Atención de reporte según tipo de problema */}
      <Route path="/technician/report/:id/attend" element={<ProtectedRoute><TechnicianAttendPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
