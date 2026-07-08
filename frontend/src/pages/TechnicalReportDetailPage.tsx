import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

type Work = {
  id: string;
  problemType: string;
  description: string;
  status: string;
  priority?: string;
  location?: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
  evidences: {
    imageUrl: string;
  }[];
};

export default function TechnicalReportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reports/${id}`);
        const data = await response.json();
        setWork(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Cargando...
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Trabajo no encontrado
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Asignado";
      case "PRIORITIZED":
        return "Aceptado";
      case "ON_ROUTE":
        return "En traslado";
      case "IN_PROGRESS":
        return "En traslado";
      case "RESOLVED":
        return "En atención";
      default:
        return status;
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await fetch(`${API_URL}/api/reports/${work.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      navigate("/technician");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/technician")}
          className="text-blue-600 font-semibold mb-8"
        >
          ← Volver
        </button>

        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-5xl font-bold">{work.problemType}</h1>
            </div>

            <span className="bg-yellow-100 text-yellow-700 px-5 py-3 rounded-full font-semibold">
              {getStatusLabel(work.status)}
            </span>
          </div>

          <img
            src={work.evidences?.[0]?.imageUrl || "https://placehold.co/1200x600"}
            alt={work.problemType}
            className="w-full h-[500px] object-cover rounded-3xl"
          />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-10">
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-bold mb-6">Descripción</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{work.description}</p>
              </div>

              <div className="bg-white rounded-3xl border p-6 shadow-sm">
                <h2 className="text-3xl font-bold mb-6">Evidencias</h2>
                <div className="grid grid-cols-2 gap-4">
                  {work.evidences?.map((evidence, index) => (
                    <img
                      key={index}
                      src={evidence.imageUrl}
                      alt={`evidence-${index}`}
                      className="w-full h-[150px] rounded-2xl object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border bg-slate-50 p-8 shadow-sm">
                <h2 className="text-3xl font-bold mb-4">Detalles</h2>
                <div className="space-y-4 text-lg text-gray-700">
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Prioridad</p>
                    <p className="mt-3 text-2xl font-semibold text-gray-900">{work.priority ?? "Null"}</p>
                  </div>

                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Ubicación</p>
                    <p className="mt-3 text-lg text-gray-800">{work.location ?? "No disponible"}</p>
                    {(typeof work.latitude !== "undefined" || typeof work.longitude !== "undefined") && (
                      <div className="mt-3 text-sm text-gray-600 space-y-1">
                        {typeof work.latitude !== "undefined" && <p>Latitud: {work.latitude}</p>}
                        {typeof work.longitude !== "undefined" && <p>Longitud: {work.longitude}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 flex gap-6">
            {work.status === "APPROVED" && (
              <button
                onClick={() => updateStatus("PRIORITIZED")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl p-5 text-xl font-semibold transition"
              >
                Aceptar trabajo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
