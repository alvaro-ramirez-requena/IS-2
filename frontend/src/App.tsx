import { Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateReportPage from "./pages/CreateReportPage";
import ReportsByProblemPage from "./pages/ReportsByProblemPage";
import MyReportsPage from "./pages/MyReportsPage";

import OperatorDashboardPage from "./pages/OperatorDashboardPage";
import OperatorReportDetailPage from "./pages/OperatorReportDetailPage";
import OperatorTechnicianApplicationsPage from "./pages/OperatorTechnicianApplicationsPage";
import OperatorMonitoringPage from "./pages/OperatorMonitoringPage";
import OperatorCatalogPage from "./pages/OperatorCatalogPage";

import TechnicianApplicationPage from "./pages/TechnicianApplicationPage";
import TechnicianApplicationVerifyEmailPage from "./pages/TechnicianApplicationVerifyEmailPage";
import TechnicianDashboardPage from "./pages/TechnicianDashboardPage";
import TechnicianReportDetailPage from "./pages/TechnicianReportDetailPage";
import TechnicianAttendPage from "./pages/TechnicianAttendPage";
import TechnicianFieldWorkPage from "./pages/TechnicianFieldWorkPage";
import TechnicianClosurePage from "./pages/TechnicianClosurePage";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminTechnicianSkillsPage from "./pages/AdminTechnicianSkillsPage";

import ProtectedRoute from "./routes/ProtectedRoute";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ReportsMapPage from "./pages/ReportsMapPage";

import Chatbot from "./components/Chatbot";


function getDashboardByRole(role: string | null) {
  if (role === "ADMIN") {
    return "/admin";
  }

  if (role === "OPERATOR") {
    return "/operator";
  }

  if (role === "TECHNICIAN") {
    return "/technician";
  }

  return "/home";
}

function PublicHomeRoute() {
  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  if (token && role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (token && role === "OPERATOR") {
    return <Navigate to="/operator" replace />;
  }

  if (token && role === "TECHNICIAN") {
    return <Navigate to="/technician" replace />;
  }

  return <HomePage />;
}

function LoginRoute() {
  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  if (token) {
    return <Navigate to={getDashboardByRole(role)} replace />;
  }

  return <LoginPage />;
}

export default function App() {
  const role = localStorage.getItem("role");

  return (
    <>
      <Routes>
        {/* Inicio ciudadano público */}
        <Route path="/" element={<PublicHomeRoute />} />

        <Route path="/home" element={<PublicHomeRoute />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/login" element={<LoginRoute />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route
          path="/technician-application/verify-email"
          element={<TechnicianApplicationVerifyEmailPage />}
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/technician/apply" element={<TechnicianApplicationPage />} />

        <Route
          path="/reports/create"
          element={
            <ProtectedRoute>
              <CreateReportPage />
            </ProtectedRoute>
          }
        />

        <Route path="/reports/problem/:problemType" element={<ReportsByProblemPage />} />

        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <MyReportsPage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/catalog"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <OperatorCatalogPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sla"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <OperatorCatalogPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/closure-reasons"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <OperatorCatalogPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/technician-skills"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminTechnicianSkillsPage />
            </ProtectedRoute>
          }
        />

        {/* OPERADOR */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={["OPERATOR"]}>
              <OperatorDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/operator/monitoring"
          element={
            <ProtectedRoute allowedRoles={["OPERATOR"]}>
              <OperatorMonitoringPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/operator/report/:id"
          element={
            <ProtectedRoute allowedRoles={["OPERATOR"]}>
              <OperatorReportDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/operator/technician-applications"
          element={
            <ProtectedRoute allowedRoles={["OPERATOR"]}>
              <OperatorTechnicianApplicationsPage />
            </ProtectedRoute>
          }
        />

        {/* Esta ruta la puedes borrar después si H21 queda solo para ADMIN */}
        <Route
          path="/operator/catalog"
          element={
            <ProtectedRoute allowedRoles={["OPERATOR"]}>
              <OperatorCatalogPage />
            </ProtectedRoute>
          }
        />

        {/* TÉCNICO */}
        <Route
          path="/technician"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/reports/:id"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianReportDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/reports/:id/attend"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianAttendPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/reports/:id/fieldwork"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianFieldWorkPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/reports/:id/closure"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianClosurePage />
            </ProtectedRoute>
          }
        />

        <Route path="/reports/map" element={<ReportsMapPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* US22 - Chatbot flotante */}
      {role !== "ADMIN" && <Chatbot />}
    </>
  );
}