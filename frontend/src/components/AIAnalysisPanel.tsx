import { useState } from "react";

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

interface AIAnalysisPanelProps {
  reportId: string;
}

const priorityStyles: Record<string, string> = {
  ALTO: "border-red-200 bg-red-50 text-red-700",
  MEDIO: "border-amber-200 bg-amber-50 text-amber-700",
  BAJO: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const priorityDotStyles: Record<string, string> = {
  ALTO: "bg-red-500",
  MEDIO: "bg-amber-500",
  BAJO: "bg-emerald-500",
};

const confidenceLabels: Record<string, string> = {
  alta: "Alta confianza",
  media: "Confianza media",
  baja: "Baja confianza",
};

const confidenceStyles: Record<string, string> = {
  alta: "border-emerald-200 bg-emerald-50 text-emerald-700",
  media: "border-amber-200 bg-amber-50 text-amber-700",
  baja: "border-gray-200 bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  REGISTERED: "Registrado",
  VALIDATING: "En validación",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  PRIORITIZED: "Priorizado",
  ASSIGNED: "Asignado",
  IN_PROGRESS: "En proceso",
  RESOLVED: "Resuelto",
};

const categoryLabels: Record<string, string> = {
  INFRASTRUCTURE: "Infraestructura y servicios",
  SECURITY: "Seguridad ciudadana",
  ENVIRONMENT: "Ambiente y limpieza",
  MOBILITY: "Movilidad y tránsito",
};

function normalizeValue(value?: string) {
  return value?.trim().toLowerCase() || "";
}

function getConfidenceLabel(confidence?: string) {
  const normalized = normalizeValue(confidence);
  return confidenceLabels[normalized] || confidence || "No determinada";
}

function getCategoryLabel(category?: string) {
  if (!category?.trim()) {
    return "No determinada";
  }

  const normalized = category.trim().toUpperCase();

  return categoryLabels[normalized] || category;
}

function getConfidenceStyle(confidence?: string) {
  const normalized = normalizeValue(confidence);

  return confidenceStyles[normalized] || "border-gray-200 bg-gray-100 text-gray-600";
}

function getPriorityStyle(priority?: string) {
  const normalized = priority?.trim().toUpperCase() || "";

  return priorityStyles[normalized] || "border-gray-200 bg-gray-50 text-gray-700";
}

function getPriorityDotStyle(priority?: string) {
  const normalized = priority?.trim().toUpperCase() || "";

  return priorityDotStyles[normalized] || "bg-gray-400";
}

function getStatusLabel(status?: string) {
  if (!status) {
    return "No especificado";
  }

  return statusLabels[status.toUpperCase()] || status;
}

function formatValue(value?: string) {
  if (!value?.trim()) {
    return "No determinado";
  }

  const normalized = value.trim().toLowerCase();

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function BrainIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9.5 4.75A3.25 3.25 0 006.25 8v.34A3.5 3.5 0 004.5 14.87V15a3.5 3.5 0 003.5 3.5h1.5m5-13.75A3.25 3.25 0 0117.75 8v.34a3.5 3.5 0 011.75 6.53V15a3.5 3.5 0 01-3.5 3.5h-1.5M9.5 4.75v14.5m5-14.5v14.5M9.5 9h5m-5 6h5"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M7.5 6.75h.008v.008H7.5V6.75z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3.75 4.5v4.379c0 .796.316 1.559.879 2.121l8.25 8.25a2.25 2.25 0 003.182 0l3.189-3.189a2.25 2.25 0 000-3.182L11 4.629a3 3 0 00-2.121-.879H4.5a.75.75 0 00-.75.75z"
      />
    </svg>
  );
}

function PriorityIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="8.25" strokeWidth={1.8} />
      <circle cx="12" cy="12" r="4.25" strokeWidth={1.8} />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M15 9l4.5-4.5M16.5 4.5h3v3"
      />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="10.5" cy="10.5" r="6.25" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeWidth={1.8} d="M15.25 15.25L20 20" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12.5l4 4L19 6.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 9v4m0 4h.01M10.29 3.86L2.82 17a2 2 0 001.74 3h14.88a2 2 0 001.74-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 px-4 py-10"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">Analizando el reporte</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          Se está evaluando la clasificación, la prioridad y la existencia de posibles duplicados.
        </p>
      </div>
    </div>
  );
}

export default function AIAnalysisPanel({ reportId }: AIAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function runAnalysis() {
    if (!reportId || loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setIsOpen(true);

    try {
      const response = await fetch(`${API}/api/ai/analyze/${encodeURIComponent(reportId)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        let message = "No se pudo completar el análisis.";

        try {
          const errorData = await response.json();

          if (typeof errorData?.message === "string") {
            message = errorData.message;
          }
        } catch {
          // La respuesta no incluía un cuerpo JSON válido.
        }

        throw new Error(message);
      }

      const data = (await response.json()) as AIAnalysis;
      setAnalysis(data);
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "No se pudo completar el análisis.";

      setError(`${message} Intenta nuevamente.`);
    } finally {
      setLoading(false);
    }
  }

  function handleToggle() {
    if (loading) {
      setIsOpen((current) => !current);
      return;
    }

    if (!analysis && !error) {
      void runAnalysis();
      return;
    }

    setIsOpen((current) => !current);
  }

  const classification = analysis?.classification;
  const prioritization = analysis?.prioritization;
  const duplicates = analysis?.duplicates;

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={`ai-analysis-content-${reportId}`}
        className="flex w-full items-start justify-between gap-3 bg-blue-50 px-4 py-4 text-left transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <BrainIcon />
          </div>

          <div className="min-w-0">
            <p className="font-semibold leading-snug text-blue-900">
              Análisis de Inteligencia Artificial
            </p>

            <p className="mt-1 text-xs leading-relaxed text-blue-600">
              Sugerencias para apoyar la evaluación del operador
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-1 text-blue-700">
          {!analysis && !loading && !error && (
            <span className="hidden rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white sm:inline-flex">
              Analizar
            </span>
          )}

          {loading && <span className="hidden text-xs font-medium sm:inline">Analizando</span>}

          <ChevronIcon open={isOpen} />
        </div>
      </button>

      {isOpen && (
        <div
          id={`ai-analysis-content-${reportId}`}
          className="border-t border-blue-100 bg-white p-4"
        >
          {loading && <LoadingState />}

          {error && !loading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4" role="alert">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 text-red-600">
                  <AlertIcon />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-red-800">
                    No fue posible analizar el reporte
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-red-700">{error}</p>

                  <button
                    type="button"
                    onClick={() => void runAnalysis()}
                    className="mt-3 inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Reintentar análisis
                  </button>
                </div>
              </div>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-4">
              {/* Clasificación */}
              <article className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4 flex items-center gap-2 text-gray-800">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                    <TagIcon />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">Clasificación</h3>
                    <p className="text-xs text-gray-500">Categoría propuesta para el reporte</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-100 bg-white p-3">
                    <p className="text-xs font-medium text-gray-500">Categoría sugerida</p>
                    <p className="mt-1 break-words text-sm font-semibold text-gray-900">
                      {getCategoryLabel(classification?.suggestedCategory)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-white p-3">
                    <p className="text-xs font-medium text-gray-500">Tipo de problema sugerido</p>
                    <p className="mt-1 break-words text-sm font-semibold leading-relaxed text-gray-900">
                      {classification?.suggestedProblemType || "No determinado"}
                    </p>
                  </div>

                  <div
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 ${
                      classification?.matches
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {classification?.matches ? <CheckIcon /> : <AlertIcon />}
                    </div>

                    <div>
                      <p className="text-xs font-semibold">
                        {classification?.matches
                          ? "La clasificación registrada coincide"
                          : "Se recomienda revisar la clasificación"}
                      </p>

                      {!classification?.matches && (
                        <p className="mt-1 text-xs leading-relaxed opacity-90">
                          La categoría propuesta por el análisis es diferente a la registrada
                          actualmente.
                        </p>
                      )}
                    </div>
                  </div>

                  {classification?.reason?.trim() && (
                    <div className="rounded-lg bg-white px-3 py-2.5">
                      <p className="text-xs font-medium text-gray-500">Motivo del análisis</p>
                      <p className="mt-1 break-words text-xs leading-relaxed text-gray-700">
                        {classification.reason}
                      </p>
                    </div>
                  )}

                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getConfidenceStyle(
                      classification?.confidence
                    )}`}
                  >
                    {getConfidenceLabel(classification?.confidence)}
                  </span>
                </div>
              </article>

              {/* Priorización */}
              <article className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4 flex items-center gap-2 text-gray-800">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
                    <PriorityIcon />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">Prioridad sugerida</h3>
                    <p className="text-xs text-gray-500">Evaluación de gravedad y riesgo</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${getPriorityStyle(
                      prioritization?.priority
                    )}`}
                  >
                    <div>
                      <p className="text-xs font-medium opacity-80">Nivel recomendado</p>
                      <p className="mt-0.5 text-xl font-bold">
                        {prioritization?.priority || "NO DETERMINADO"}
                      </p>
                    </div>

                    <span
                      className={`h-3 w-3 rounded-full ${getPriorityDotStyle(
                        prioritization?.priority
                      )}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0 rounded-lg border border-gray-100 bg-white p-3">
                      <p className="text-xs font-medium text-gray-500">Gravedad</p>
                      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                        {formatValue(prioritization?.gravedad)}
                      </p>
                    </div>

                    <div className="min-w-0 rounded-lg border border-gray-100 bg-white p-3">
                      <p className="text-xs font-medium text-gray-500">Riesgo</p>
                      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                        {formatValue(prioritization?.riesgo)}
                      </p>
                    </div>
                  </div>

                  {prioritization?.justification?.trim() && (
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs font-medium text-gray-500">Justificación</p>
                      <p className="mt-1 break-words text-xs leading-relaxed text-gray-700">
                        {prioritization.justification}
                      </p>
                    </div>
                  )}

                  <p className="text-xs leading-relaxed text-gray-500">
                    La prioridad es una sugerencia. El operador conserva la decisión final.
                  </p>
                </div>
              </article>

              {/* Duplicados */}
              <article className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4 flex items-center gap-2 text-gray-800">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-sm">
                    <DuplicateIcon />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">Detección de duplicados</h3>
                    <p className="text-xs text-gray-500">Reportes similares en la misma zona</p>
                  </div>
                </div>

                {!duplicates?.hasDuplicates ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <CheckIcon />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-emerald-800">
                          Sin duplicados detectados
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-emerald-700">
                          No se encontraron reportes similares en un radio de 200 metros durante los
                          últimos 30 días.
                        </p>

                        <span
                          className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getConfidenceStyle(
                            duplicates?.confidence
                          )}`}
                        >
                          {getConfidenceLabel(duplicates?.confidence)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-800">
                      <div className="mt-0.5 shrink-0">
                        <AlertIcon />
                      </div>

                      <div>
                        <p className="text-xs font-semibold">
                          Se encontraron {duplicates.duplicates?.length || 0} posibles duplicados
                        </p>
                        <p className="mt-1 text-xs leading-relaxed">
                          Revisa los reportes antes de aprobar o priorizar esta incidencia.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {duplicates.duplicates?.map((duplicate) => (
                        <div
                          key={duplicate.id}
                          className="min-w-0 rounded-lg border border-gray-200 bg-white p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="min-w-0 break-words text-sm font-semibold text-gray-800">
                              {duplicate.problemType || "Tipo no especificado"}
                            </p>

                            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                              {getStatusLabel(duplicate.status)}
                            </span>
                          </div>

                          <p className="mt-2 break-words text-xs leading-relaxed text-gray-600">
                            {duplicate.address || "Dirección no disponible"}
                          </p>

                          {typeof duplicate.daysDelayed === "number" && (
                            <p className="mt-2 text-xs text-gray-500">
                              Registrado hace {duplicate.daysDelayed}{" "}
                              {duplicate.daysDelayed === 1 ? "día" : "días"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getConfidenceStyle(
                        duplicates.confidence
                      )}`}
                    >
                      {getConfidenceLabel(duplicates.confidence)}
                    </span>
                  </div>
                )}
              </article>

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-gray-400">
                  Resultado orientativo generado automáticamente.
                </p>

                <button
                  type="button"
                  onClick={() => void runAnalysis()}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v6h6M20 20v-6h-6M5.64 18.36A8 8 0 0018.36 5.64L20 7M4 17l1.64 1.36"
                    />
                  </svg>
                  Volver a analizar
                </button>
              </div>
            </div>
          )}

          {!analysis && !loading && !error && (
            <div className="py-5 text-center">
              <p className="text-sm font-medium text-gray-700">
                El reporte todavía no ha sido analizado
              </p>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-gray-500">
                Ejecuta el análisis para recibir sugerencias sobre la clasificación, prioridad y
                posibles duplicados.
              </p>

              <button
                type="button"
                onClick={() => void runAnalysis()}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Ejecutar análisis
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
