import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import RegisterPage
  from "./pages/RegisterPage";

import VerifyEmailPage
  from "./pages/VerifyEmailPage";

import LoginPage
  from "./pages/LoginPage";

import HomePage
  from "./pages/HomePage";

import CreateReportPage
  from "./pages/CreateReportPage";

import ReportsByProblemPage
  from "./pages/ReportsByProblemPage";

import MyReportsPage
  from "./pages/MyReportsPage";

import OperatorDashboardPage
  from "./pages/OperatorDashboardPage";

import OperatorReportDetailPage
  from "./pages/OperatorReportDetailPage";

import ProtectedRoute
  from "./routes/ProtectedRoute";

import ForgotPasswordPage
  from "./pages/ForgotPasswordPage";

import ResetPasswordPage
  from "./pages/ResetPasswordPage";

import TechnicianApplicationPage
  from "./pages/TechnicianApplicationPage";

import OperatorTechnicianApplicationsPage
  from "./pages/OperatorTechnicianApplicationsPage";

import TechnicianDashboardPage
  from "./pages/TechnicianDashboardPage";

import ReportsMapPage
  from "./pages/ReportsMapPage";

export default function App() {

  return (

    <Routes>

      {/* Inicio ciudadano público */}
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/home"
        element={<HomePage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmailPage />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      <Route
        path="/technician/apply"
        element={<TechnicianApplicationPage />}
      />

      <Route
        path="/reports/create"
        element={
          <ProtectedRoute>
            <CreateReportPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/problem/:problemType"
        element={<ReportsByProblemPage />}
      />

      <Route
        path="/my-reports"
        element={
          <ProtectedRoute>
            <MyReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operator"
        element={
          <ProtectedRoute allowedRoles={["OPERATOR"]}>
            <OperatorDashboardPage />
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

      <Route
        path="/technician"
        element={
          <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
            <TechnicianDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/map"
        element={<ReportsMapPage />}
      />
      <Route
        path="*"
        element={
          <Navigate to="/" />
        }
      />

    </Routes>

  );
}