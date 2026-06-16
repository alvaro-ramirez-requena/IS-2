import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import RegisterPage
  from "./pages/RegisterPage";

import LoginPage
  from "./pages/LoginPage";

import HomePage
  from "./pages/HomePage";

import CreateReportPage
  from "./pages/CreateReportPage";

import ReportsByProblemPage
  from "./pages/ReportsByProblemPage";

import MyReportsPage from "./pages/MyReportsPage";

import OperatorDashboardPage
  from "./pages/OperatorDashboardPage";

import OperatorReportDetailPage
  from "./pages/OperatorReportDetailPage";
import TechnicianDashboardPage from "./pages/TechnicalDashboardPage";

export default function App() {

  return (

    <Routes>

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/home"
        element={<HomePage />}
      />

      <Route
        path="/reports/create"
        element={<CreateReportPage />}
      />

      <Route
        path="/reports/problem/:problemType"
        element={<ReportsByProblemPage />}
      />

      <Route
        path="/my-reports"
        element={<MyReportsPage />}
      />

      <Route
        path="/operator"
        element={
          <OperatorDashboardPage />
        }
      />

      <Route
        path="/operator/report/:id"
        element={
          <OperatorReportDetailPage />
        }
      />

      <Route
        path="/technician"
        element={
          <TechnicianDashboardPage />
        }
/>

      <Route
        path="*"
        element={
          <Navigate to="/login" />
        }
      />
    </Routes>
  );
}