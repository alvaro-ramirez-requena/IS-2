import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface DelayedReport {
  id: string;
  problemType: string;
  status: string;
  address: string;
  daysDelayed: number;
  expectedDays: number;
  alertLevel: "CRITICO" | "ADVERTENCIA";
}

interface DelayResult {
  total: number;
  alerts: DelayedReport[];
}

const statusLabels: Record<string, string> = {
  REGISTERED: "Registrado",
  VALIDATING: "En validación",
  APPROVED: "Aprobado",
  PRIORITIZED: "Priorizado",
  ASSIGNED: "Asignado",
  IN_PROGRESS: "En progreso",
  RESOLVED: "Resuelto",
};

export default function DelayAlertsPanel() {
  const navigate = useNavigate();
  const [data, setData] = useState<DelayResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/ai/delays`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-full mb-2" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <div className="bg-white rounded-2xl border p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⏰</span>
          <h3 className="font-semibold text-gray-700">Alertas por retraso</h3>
        </div>
        <p className="text-sm text-green-600">✅ No hay reportes con retrasos significativos.</p>
      </div>
    );
  }

  const criticos = data.alerts.filter((a) => a.alertLevel === "CRITICO").length;
  const advertencias = data.alerts.filter((a) => a.alertLevel === "ADVERTENCIA").length;

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">

      {/* Header */}
      <div className={`px-5 py-3 flex items-center justify-between ${criticos > 0 ? "bg-red-50" : "bg-yellow-50"}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">⏰</span>
          <h3 className={`font-semibold ${criticos > 0 ? "text-red-700" : "text-yellow-700"}`}>
            Alertas por retraso
          </h3>
        </div>
        <div className="flex gap-2">
          {criticos > 0 && (
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
              {criticos} crítico{criticos > 1 ? "s" : ""}
            </span>
          )}
          {advertencias > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
              {advertencias} advertencia{advertencias > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Lista */}
      <div className="divide-y divide-gray-50">
        {data.alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => navigate(`/operator/report/${alert.id}`)}
            className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-800 truncate">{alert.problemType}</p>
              <p className="text-xs text-gray-500 truncate">{alert.address || "Sin dirección"}</p>
              <p className="text-xs text-gray-400 mt-0.5">Estado: {statusLabels[alert.status] || alert.status}</p>
            </div>
            <div className="ml-3 text-right flex-shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                alert.alertLevel === "CRITICO"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {alert.daysDelayed}d de retraso
              </span>
              <p className="text-xs text-gray-400 mt-1">Límite: {alert.expectedDays}d</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
