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
        path="*"
        element={
          <Navigate to="/login" />
        }
      />
    </Routes>
  );
}