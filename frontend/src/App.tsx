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

export default function App() {

  return (

    <Routes>

      {/* Inicio ciudadano público */}
      <Route
        path="/"
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

      {/* También puedes dejar /home como inicio ciudadano */}
      <Route
        path="/home"
        element={<HomePage />}
      />

      {/* Estas sí deben estar protegidas */}
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
        element={
          <ProtectedRoute>
            <ReportsByProblemPage />
          </ProtectedRoute>
        }
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
          <ProtectedRoute>
            <OperatorDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operator/report/:id"
        element={
          <ProtectedRoute>
            <OperatorReportDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Si la ruta no existe, manda al inicio ciudadano, no al login */}
      <Route
        path="*"
        element={
          <Navigate to="/" />
        }
      />

    </Routes>
  );
}