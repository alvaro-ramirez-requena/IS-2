import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function DashboardPage() {
  const navigate = useNavigate();
  const userRaw = localStorage.getItem("auth_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/50">
        <h1 className="text-3xl font-bold">Sesión iniciada</h1>
        <p className="mt-2 text-slate-300">
          Este espacio queda listo para conectar con US03 y US04.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
          <div>
            <span className="font-semibold text-white">Usuario:</span>{" "}
            {user?.firstName} {user?.lastName}
          </div>
          <div className="mt-1">
            <span className="font-semibold text-white">Correo:</span> {user?.email}
          </div>
          <div className="mt-1">
            <span className="font-semibold text-white">Rol:</span> {user?.role}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            navigate("/login", { replace: true });
          }}
          className="mt-6 rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-950 transition hover:bg-white"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}