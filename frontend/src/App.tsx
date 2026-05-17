import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RegisterReport from "./pages/RegisterReport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register-report" element={<RegisterReport />} />
      </Routes>
    </BrowserRouter>
  );
}