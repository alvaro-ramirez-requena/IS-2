import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Classification {
  suggestedCategory: string;
  suggestedProblemType: string;
  confidence: string;
  matches: boolean;
  reason: string;
}

interface Prioritization {
  priority: string;
  gravedad: string;
  riesgo: string;
  justification: string;
}

interface Duplicate {
  id: string;
  problemType: string;
  address: string;
  status: string;
  daysDelayed?: number;
}

interface DuplicatesResult {
  duplicates: Duplicate[];
  hasDuplicates: boolean;
  confidence: string;
}

interface AIAnalysis {
  classification: Classification;
  prioritization: Prioritization;
  duplicates: DuplicatesResult;
}

const priorityColors: Record<string, string> = {
  ALTO: "bg-red-100 text-red-700 border-red-200",
  MEDIO: "bg-yellow-100 text-yellow-700 border-yellow-200",
  BAJO: "bg-green-100 text-green-700 border-green-200",
};

const confidenceLabel: Record<string, string> = {
  alta: "Alta confianza",
  media: "Confianza media",
  baja: "Baja confianza",
};

export default function AIAnalysisPanel({ reportId }: { reportId: string }) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    setIsOpen(true);
    try {
      const res = await fetch(`${API}/api/ai/analyze/${reportId}`);
      if (!res.ok) throw new Error("Error al analizar");
      const data = await res.json();
      setAnalysis(data);
    } catch {
      setError("No se pudo completar el análisis. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 border border-blue-100 rounded-2xl overflow-hidden">

      {/* Header del panel */}
      <button
        onClick={() => isOpen ? setIsOpen(false) : (analysis ? setIsOpen(true) : runAnalysis())}
        className="w-full flex items-center justify-between px-6 py-4 bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-semibold text-blue-800">Análisis de Inteligencia Artificial</p>
            <p className="text-xs text-blue-500">Clasificación, prioridad y detección de duplicados</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!analysis && !loading && (
            <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">Analizar</span>
          )}
          {loading && (
            <span className="text-xs text-blue-600">Analizando...</span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 text-blue-600 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Contenido */}
      {isOpen && (
        <div className="p-6 bg-white">

          {loading && (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="flex gap-1">
                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-sm text-gray-500">Analizando reporte con IA...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
              <button onClick={runAnalysis} className="ml-auto text-red-700 underline text-xs">Reintentar</button>
            </div>
          )}

          {analysis && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Clasificación */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span>🏷️</span> Clasificación
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Categoría sugerida</p>
                    <p className="font-medium text-sm">{analysis.classification.suggestedCategory}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tipo de problema</p>
                    <p className="font-medium text-sm">{analysis.classification.suggestedProblemType}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                    analysis.classification.matches ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {analysis.classification.matches ? "✅ Clasificación correcta" : "⚠️ Posible reclasificación"}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{analysis.classification.reason}</p>
                  <p className="text-xs text-gray-400">{confidenceLabel[analysis.classification.confidence]}</p>
                </div>
              </div>

              {/* Priorización */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span>🎯</span> Prioridad sugerida
                </h3>
                <div className="space-y-3">
                  <div className={`text-center py-3 rounded-xl border font-bold text-xl ${priorityColors[analysis.prioritization.priority] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                    {analysis.prioritization.priority}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Gravedad</p>
                      <p className="text-sm font-medium capitalize">{analysis.prioritization.gravedad}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Riesgo</p>
                      <p className="text-sm font-medium capitalize">{analysis.prioritization.riesgo}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{analysis.prioritization.justification}</p>
                </div>
              </div>

              {/* Duplicados */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span>🔍</span> Detección de duplicados
                </h3>
                {!analysis.duplicates.hasDuplicates ? (
                  <div className="flex flex-col items-center py-4 gap-2">
                    <span className="text-3xl">✅</span>
                    <p className="text-sm text-green-700 font-medium">Sin duplicados detectados</p>
                    <p className="text-xs text-gray-400 text-center">No se encontraron reportes similares en un radio de 200 metros en los últimos 30 días</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-yellow-50 text-yellow-700 text-xs px-3 py-2 rounded-lg">
                      ⚠️ Se encontraron {analysis.duplicates.duplicates.length} posible(s) duplicado(s)
                    </div>
                    {analysis.duplicates.duplicates.map((d) => (
                      <div key={d.id} className="bg-white rounded-lg p-2 text-xs border border-yellow-100">
                        <p className="font-medium">{d.problemType}</p>
                        <p className="text-gray-500 truncate">{d.address || "Sin dirección"}</p>
                        <p className="text-gray-400">Estado: {d.status}</p>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400">Confianza: {analysis.duplicates.confidence}</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {analysis && !loading && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={runAnalysis}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                🔄 Volver a analizar
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
