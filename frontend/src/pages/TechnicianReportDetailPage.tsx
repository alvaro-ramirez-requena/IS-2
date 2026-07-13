import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { statusLabels } from "../utils/reportLabels";

import { formatTargetDate, getPriorityLabel, getSlaViewState } from "../utils/sla.utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const technicalClosureResultLabels: Record<string, string> = {
  RESOLVED_ON_SITE: "Resuelto en sitio",

  TEMPORARY_MITIGATION: "Mitigación temporal",

  NO_INCIDENT_FOUND: "No se encontró incidencia",

  DUPLICATE: "Reporte duplicado",

  OUT_OF_SCOPE: "Fuera de competencia",

  FOLLOW_UP_REQUIRED: "Seguimiento requerido",
};

const technicianStatusStyles: Record<string, string> = {
  ASSIGNED: "border-amber-200 bg-amber-50 text-amber-700",

  IN_TRANSIT: "border-yellow-200 bg-yellow-50 text-yellow-700",

  IN_PROGRESS: "border-emerald-200 bg-emerald-50 text-emerald-700",

  RESOLVED: "border-green-200 bg-green-50 text-green-700",

  PRIORITIZED: "border-slate-200 bg-slate-100 text-slate-700",
};

const priorityStyles: Record<string, string> = {
  ALTO: "border-red-200 bg-red-50 text-red-700",

  MEDIO: "border-amber-200 bg-amber-50 text-amber-700",

  BAJO: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const progressSteps = [
  {
    status: "ASSIGNED",
    label: "Asignado",
    description: "El reporte fue asignado al técnico.",
  },
  {
    status: "IN_TRANSIT",
    label: "En traslado",
    description: "El técnico se dirige a la ubicación.",
  },
  {
    status: "IN_PROGRESS",
    label: "En atención",
    description: "La intervención se encuentra en curso.",
  },
  {
    status: "RESOLVED",
    label: "Finalizado",
    description: "Se registró el cierre técnico.",
  },
];

type Report = {
  id: string;
  title?: string;
  problemType: string;
  description: string;
  status: string;
  priority?: string;
  targetDate?: string | null;
  address?: string;
  latitude?: number;
  longitude?: number;

  evidences?: {
    imageUrl: string;
  }[];

  fieldWork?: {
    arrivedAt?: string | null;
    closedAt?: string | null;
    notes?: string | null;
    distanceMeters?: number | null;

    evidences?: {
      id: string;
      imageUrl: string;
      phase: "BEFORE" | "AFTER";
    }[];
  } | null;

  technicalAttentions?: {
    id: string;
    actionTaken: string;
    technicalResult: string;
    observations?: string | null;
    createdAt: string;
  }[];

  technicalClosure?: {
    id: string;
    result: string;
    observations: string;
    closureEvidenceUrl?: string | null;
    followUpRequired: boolean;
    followUpNotes?: string | null;
    closedAt: string;

    technician?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  } | null;
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return "No registrado";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusStyle(status?: string) {
  return technicianStatusStyles[status || ""] || "border-slate-200 bg-slate-100 text-slate-700";
}

function getPriorityStyle(priority?: string) {
  return (
    priorityStyles[priority?.toUpperCase() || ""] || "border-slate-200 bg-slate-50 text-slate-700"
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-emerald-50
            text-emerald-700
        "
    >
      {children}
    </div>
  );
}

function InfoCard({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="
            min-w-0
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
        "
    >
      <p
        className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
            "
      >
        {label}
      </p>

      {children || (
        <p
          className="
                    mt-2
                    break-words
                    text-sm
                    font-semibold
                    leading-relaxed
                    text-slate-800
                "
        >
          {value || "No registrado"}
        </p>
      )}
    </div>
  );
}

function EmptyImageIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-12 w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 16.5l5-5 4 4 3-3 6 6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
      />
      <circle cx="8.5" cy="8.5" r="1.25" />
    </svg>
  );
}

export default function TechnicianReportDetailPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(`${API_URL}/api/reports/${id}`);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "No se pudo cargar el trabajo.");
      }

      setReport(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo cargar el trabajo.";

      setErrorMessage(message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchReport();
  }, [id]);

  const updateStatus = async (status: string) => {
    if (!report || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const response = await fetch(`${API_URL}/api/reports/${report.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "No se pudo actualizar el estado.");
      }

      await fetchReport();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar el estado.";

      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const currentProgressIndex = useMemo(() => {
    if (!report) {
      return 0;
    }

    const index = progressSteps.findIndex((step) => step.status === report.status);

    return index >= 0 ? index : 0;
  }, [report]);

  if (loading) {
    return (
      <div
        className="
                min-h-screen
                bg-slate-50
                flex
                items-center
                justify-center
                px-6
            "
      >
        <div
          className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    px-10
                    py-8
                    text-center
                    shadow-sm
                "
        >
          <div
            className="
                        mx-auto
                        mb-4
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-emerald-100
                        border-t-emerald-600
                    "
          />

          <p
            className="
                        font-semibold
                        text-slate-800
                    "
          >
            Cargando trabajo asignado
          </p>

          <p
            className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
          >
            Estamos recuperando la información del reporte.
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div
        className="
                min-h-screen
                bg-slate-50
                flex
                items-center
                justify-center
                px-6
            "
      >
        <div
          className="
                    w-full
                    max-w-md
                    rounded-3xl
                    border
                    border-red-200
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                "
        >
          <div
            className="
                        mx-auto
                        mb-4
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                        text-2xl
                    "
          >
            ⚠
          </div>

          <h1
            className="
                        text-xl
                        font-bold
                        text-slate-900
                    "
          >
            No se pudo abrir el trabajo
          </h1>

          <p
            className="
                        mt-2
                        text-sm
                        leading-relaxed
                        text-slate-500
                    "
          >
            {errorMessage || "El reporte solicitado no existe o ya no está disponible."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/technician")}
            className="
                            mt-6
                            w-full
                            rounded-xl
                            bg-emerald-600
                            px-4
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-emerald-700
                        "
          >
            Volver al panel técnico
          </button>
        </div>
      </div>
    );
  }

  const primaryImage = report.evidences?.[0]?.imageUrl;

  const beforeEvidences =
    report.fieldWork?.evidences?.filter((evidence) => evidence.phase === "BEFORE") || [];

  const afterEvidences =
    report.fieldWork?.evidences?.filter((evidence) => evidence.phase === "AFTER") || [];

  const latestAttention = report.technicalAttentions?.[0];

  const slaState = getSlaViewState(report.targetDate, report.status);

  const hasCoordinates =
    report.latitude !== null &&
    report.latitude !== undefined &&
    report.longitude !== null &&
    report.longitude !== undefined;

  const reportStatus = statusLabels[report.status] || report.status;

  return (
    <div
      className="
            min-h-screen
            bg-slate-50
        "
    >
      {/* Barra superior */}
      <header
        className="
                sticky
                top-0
                z-30
                border-b
                border-emerald-800
                bg-[#064E3B]
                text-white
                shadow-sm
            "
      >
        <div
          className="
                    mx-auto
                    flex
                    max-w-7xl
                    items-center
                    justify-between
                    gap-4
                    px-5
                    py-4
                    lg:px-8
                "
        >
          <button
            type="button"
            onClick={() => navigate("/technician")}
            className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            px-3
                            py-2
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-white/10
                        "
          >
            <span aria-hidden="true">←</span>
            Volver al panel técnico
          </button>

          <div
            className="
                        hidden
                        items-center
                        gap-2
                        sm:flex
                    "
          >
            <span
              className="
                            text-xl
                            font-bold
                            tracking-tight
                            text-white
                        "
            >
              reporta
              <span className="text-[#FACC15]">Ya</span>
            </span>

            <span
              className="
                            rounded-full
                            bg-emerald-50
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-emerald-700
                        "
            >
              Módulo técnico
            </span>
          </div>
        </div>
      </header>

      <main
        className="
                mx-auto
                max-w-7xl
                px-5
                py-8
                lg:px-8
                lg:py-10
            "
      >
        {errorMessage && (
          <div
            role="alert"
            className="
                            mb-6
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-sm
                            text-red-700
                        "
          >
            <span aria-hidden="true">⚠</span>

            <div className="flex-1">
              <p className="font-semibold">No se pudo completar la operación</p>

              <p className="mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Encabezado */}
        <section
          className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
        >
          <div
            className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1.25fr_0.75fr]
                    "
          >
            <div
              className="
                            p-6
                            sm:p-8
                            lg:p-10
                        "
            >
              <div
                className="
                                mb-5
                                flex
                                flex-wrap
                                items-center
                                gap-3
                            "
              >
                <span
                  className="
                                    rounded-full
                                    bg-emerald-50
                                    px-3
                                    py-1
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-emerald-700
                                "
                >
                  Trabajo asignado
                </span>

                <span
                  className={`
                                    rounded-full
                                    border
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    ${getStatusStyle(report.status)}
                                `}
                >
                  {reportStatus}
                </span>
              </div>

              <h1
                className="
                                max-w-3xl
                                text-3xl
                                font-bold
                                leading-tight
                                tracking-tight
                                text-slate-950
                                sm:text-4xl
                                lg:text-5xl
                            "
              >
                {report.title || report.problemType}
              </h1>

              <p
                className="
                                mt-3
                                text-lg
                                font-medium
                                text-slate-500
                            "
              >
                {report.problemType}
              </p>

              <div
                className="
                                mt-7
                                flex
                                flex-wrap
                                gap-3
                            "
              >
                <span
                  className={`
                                    rounded-xl
                                    border
                                    px-3
                                    py-2
                                    text-sm
                                    font-semibold
                                    ${getPriorityStyle(report.priority)}
                                `}
                >
                  Prioridad: {getPriorityLabel(report.priority)}
                </span>

                <span
                  className={`
                                    rounded-xl
                                    px-3
                                    py-2
                                    text-sm
                                    font-semibold
                                    ${slaState.className}
                                `}
                >
                  SLA: {slaState.label}
                </span>
              </div>
            </div>

            <div
              className="
                            relative
                            min-h-[260px]
                            bg-slate-100
                            lg:min-h-full
                        "
            >
              {primaryImage ? (
                <>
                  <img
                    src={primaryImage}
                    alt={`Evidencia del reporte: ${report.problemType}`}
                    className="
                                            absolute
                                            inset-0
                                            h-full
                                            w-full
                                            object-cover
                                        "
                  />

                  <div
                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/40
                                        via-transparent
                                        to-transparent
                                    "
                  />

                  <span
                    className="
                                        absolute
                                        bottom-4
                                        left-4
                                        rounded-full
                                        bg-black/60
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-white
                                        backdrop-blur
                                    "
                  >
                    Evidencia ciudadana
                  </span>
                </>
              ) : (
                <div
                  className="
                                    flex
                                    h-full
                                    min-h-[260px]
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-3
                                    text-slate-400
                                "
                >
                  <EmptyImageIcon />

                  <p
                    className="
                                        text-sm
                                        font-medium
                                    "
                  >
                    No hay evidencia inicial
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Progreso */}
        <section
          className="
                    mt-6
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    sm:p-6
                "
        >
          <div
            className="
                        mb-5
                        flex
                        flex-col
                        gap-1
                    "
          >
            <h2
              className="
                            text-lg
                            font-bold
                            text-slate-900
                        "
            >
              Progreso de la atención
            </h2>

            <p
              className="
                            text-sm
                            text-slate-500
                        "
            >
              Consulta en qué etapa se encuentra actualmente el trabajo.
            </p>
          </div>

          <div
            className="
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
          >
            {progressSteps.map((step, index) => {
              const completed = index < currentProgressIndex;

              const active = index === currentProgressIndex;

              return (
                <div
                  key={step.status}
                  className={`
                                            rounded-2xl
                                            border
                                            p-4
                                            transition
                                            ${
                                              active
                                                ? "border-emerald-300 bg-emerald-50"
                                                : completed
                                                  ? "border-emerald-200 bg-white"
                                                  : "border-slate-200 bg-slate-50"
                                            }
                                        `}
                >
                  <div
                    className="
                                            flex
                                            items-start
                                            gap-3
                                        "
                  >
                    <div
                      className={`
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                text-xs
                                                font-bold
                                                ${
                                                  active || completed
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-slate-200 text-slate-500"
                                                }
                                            `}
                    >
                      {completed ? "✓" : index + 1}
                    </div>

                    <div>
                      <p
                        className={`
                                                    text-sm
                                                    font-semibold
                                                    ${
                                                      active ? "text-emerald-800" : "text-slate-800"
                                                    }
                                                `}
                      >
                        {step.label}
                      </p>

                      <p
                        className="
                                                    mt-1
                                                    text-xs
                                                    leading-relaxed
                                                    text-slate-500
                                                "
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div
          className="
                    mt-6
                    grid
                    grid-cols-1
                    gap-6
                    xl:grid-cols-[minmax(0,1fr)_360px]
                "
        >
          {/* Contenido principal */}
          <div className="space-y-6">
            <section
              className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            sm:p-8
                        "
            >
              <div
                className="
                                mb-5
                                flex
                                items-start
                                gap-3
                            "
              >
                <Icon>
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
                      d="M8 10h8M8 14h5m-8 6l2.5-3H19a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2v3z"
                    />
                  </svg>
                </Icon>

                <div>
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                  >
                    Descripción del reporte
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                  >
                    Información registrada por el ciudadano.
                  </p>
                </div>
              </div>

              <p
                className="
                                whitespace-pre-line
                                text-base
                                leading-8
                                text-slate-700
                            "
              >
                {report.description}
              </p>
            </section>

            <section
              className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            sm:p-8
                        "
            >
              <div
                className="
                                mb-5
                                flex
                                items-start
                                gap-3
                            "
              >
                <Icon>
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
                      d="M12 21s7-5.25 7-12a7 7 0 10-14 0c0 6.75 7 12 7 12z"
                    />
                    <circle cx="12" cy="9" r="2.25" />
                  </svg>
                </Icon>

                <div>
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                  >
                    Ubicación y datos operativos
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                  >
                    Información útil para realizar la intervención.
                  </p>
                </div>
              </div>

              <div
                className="
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                            "
              >
                <InfoCard label="Dirección" value={report.address || "Ubicación no registrada"} />

                <InfoCard label="Fecha objetivo" value={formatTargetDate(report.targetDate)} />

                <InfoCard label="Tiempo de atención">
                  <div className="mt-2">
                    <span
                      className={`
                                            inline-flex
                                            rounded-full
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-semibold
                                            ${slaState.className}
                                        `}
                    >
                      {slaState.label}
                    </span>

                    <p
                      className="
                                            mt-2
                                            text-xs
                                            leading-relaxed
                                            text-slate-500
                                        "
                    >
                      {slaState.description}
                    </p>
                  </div>
                </InfoCard>

                <InfoCard label="Prioridad">
                  <span
                    className={`
                                        mt-2
                                        inline-flex
                                        rounded-full
                                        border
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        ${getPriorityStyle(report.priority)}
                                    `}
                  >
                    {getPriorityLabel(report.priority)}
                  </span>
                </InfoCard>

                {report.fieldWork && (
                  <>
                    <InfoCard
                      label="Llegada registrada"
                      value={formatDateTime(report.fieldWork.arrivedAt)}
                    />

                    <InfoCard
                      label="Cierre de visita"
                      value={formatDateTime(report.fieldWork.closedAt)}
                    />

                    <InfoCard
                      label="Distancia registrada"
                      value={
                        report.fieldWork.distanceMeters !== null &&
                        report.fieldWork.distanceMeters !== undefined
                          ? `${report.fieldWork.distanceMeters.toFixed(0)} metros`
                          : "No calculada"
                      }
                    />

                    <InfoCard
                      label="Notas de campo"
                      value={report.fieldWork.notes || "Sin notas registradas"}
                    />
                  </>
                )}
              </div>

              {hasCoordinates && (
                <a
                  href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                                        mt-5
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-emerald-200
                                        bg-emerald-50
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-emerald-700
                                        transition
                                        hover:border-emerald-300
                                        hover:bg-emerald-100
                                    "
                >
                  <span aria-hidden="true">↗</span>
                  Abrir ubicación en Google Maps
                </a>
              )}
            </section>

            {report.status === "RESOLVED" && (
              <>
                <section
                  className="
                                    rounded-3xl
                                    border
                                    border-emerald-200
                                    bg-emerald-50/40
                                    p-6
                                    shadow-sm
                                    sm:p-8
                                "
                >
                  <div
                    className="
                                        mb-6
                                        flex
                                        items-start
                                        gap-3
                                    "
                  >
                    <div
                      className="
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-emerald-600
                                            text-lg
                                            text-white
                                        "
                    >
                      ✓
                    </div>

                    <div>
                      <h2
                        className="
                                                text-xl
                                                font-bold
                                                text-slate-900
                                            "
                      >
                        Cierre operativo
                      </h2>

                      <p
                        className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                            "
                      >
                        Resultado final registrado por el técnico.
                      </p>
                    </div>
                  </div>

                  {report.technicalClosure ? (
                    <div
                      className="
                                            grid
                                            grid-cols-1
                                            gap-5
                                            lg:grid-cols-2
                                        "
                    >
                      <div
                        className="
                                                space-y-4
                                                rounded-2xl
                                                border
                                                border-emerald-100
                                                bg-white
                                                p-5
                                            "
                      >
                        <InfoCard
                          label="Resultado técnico"
                          value={
                            technicalClosureResultLabels[report.technicalClosure.result] ||
                            report.technicalClosure.result
                          }
                        />

                        <InfoCard
                          label="Fecha de cierre"
                          value={formatDateTime(report.technicalClosure.closedAt)}
                        />

                        {report.technicalClosure.technician && (
                          <InfoCard
                            label="Técnico responsable"
                            value={`${report.technicalClosure.technician.firstName} ${report.technicalClosure.technician.lastName}`}
                          />
                        )}
                      </div>

                      <div
                        className="
                                                space-y-4
                                                rounded-2xl
                                                border
                                                border-emerald-100
                                                bg-white
                                                p-5
                                            "
                      >
                        <div>
                          <p
                            className="
                                                        text-xs
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        text-slate-400
                                                    "
                          >
                            Observaciones
                          </p>

                          <p
                            className="
                                                        mt-2
                                                        whitespace-pre-line
                                                        text-sm
                                                        leading-7
                                                        text-slate-700
                                                    "
                          >
                            {report.technicalClosure.observations}
                          </p>
                        </div>

                        {report.technicalClosure.followUpRequired && (
                          <div
                            className="
                                                        rounded-xl
                                                        border
                                                        border-amber-200
                                                        bg-amber-50
                                                        p-4
                                                    "
                          >
                            <p
                              className="
                                                            text-sm
                                                            font-semibold
                                                            text-amber-800
                                                        "
                            >
                              Requiere seguimiento
                            </p>

                            <p
                              className="
                                                            mt-1
                                                            text-sm
                                                            leading-relaxed
                                                            text-amber-700
                                                        "
                            >
                              {report.technicalClosure.followUpNotes ||
                                "No se indicaron notas adicionales."}
                            </p>
                          </div>
                        )}
                      </div>

                      {report.technicalClosure.closureEvidenceUrl && (
                        <a
                          href={report.technicalClosure.closureEvidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                                                        group
                                                        overflow-hidden
                                                        rounded-2xl
                                                        border
                                                        border-slate-200
                                                        bg-white
                                                        lg:col-span-2
                                                    "
                        >
                          <img
                            src={report.technicalClosure.closureEvidenceUrl}
                            alt="Evidencia de cierre"
                            className="
                                                            h-72
                                                            w-full
                                                            object-cover
                                                            transition
                                                            duration-300
                                                            group-hover:scale-[1.01]
                                                        "
                          />

                          <div
                            className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        px-5
                                                        py-4
                                                    "
                          >
                            <span
                              className="
                                                            text-sm
                                                            font-semibold
                                                            text-slate-800
                                                        "
                            >
                              Evidencia del cierre
                            </span>

                            <span
                              className="
                                                            text-sm
                                                            font-semibold
                                                            text-emerald-700
                                                        "
                            >
                              Ver imagen ↗
                            </span>
                          </div>
                        </a>
                      )}
                    </div>
                  ) : (
                    <div
                      className="
                                            rounded-2xl
                                            border
                                            border-amber-200
                                            bg-amber-50
                                            p-5
                                            text-sm
                                            text-amber-700
                                        "
                    >
                      El reporte está resuelto, pero todavía no se encontró un cierre técnico
                      registrado.
                    </div>
                  )}
                </section>

                {latestAttention && (
                  <section
                    className="
                                        rounded-3xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-6
                                        shadow-sm
                                        sm:p-8
                                    "
                  >
                    <h2
                      className="
                                            text-xl
                                            font-bold
                                            text-slate-900
                                        "
                    >
                      Atención técnica previa
                    </h2>

                    <p
                      className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                        "
                    >
                      Registro preliminar realizado antes del cierre.
                    </p>

                    <div
                      className="
                                            mt-5
                                            grid
                                            grid-cols-1
                                            gap-4
                                            sm:grid-cols-2
                                        "
                    >
                      <InfoCard label="Acción realizada" value={latestAttention.actionTaken} />

                      <InfoCard
                        label="Resultado preliminar"
                        value={latestAttention.technicalResult}
                      />

                      <div
                        className="
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-white
                                                p-4
                                                sm:col-span-2
                                            "
                      >
                        <p
                          className="
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wide
                                                    text-slate-400
                                                "
                        >
                          Observaciones
                        </p>

                        <p
                          className="
                                                    mt-2
                                                    text-sm
                                                    leading-7
                                                    text-slate-700
                                                "
                        >
                          {latestAttention.observations || "Sin observaciones registradas."}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                <section
                  className="
                                    rounded-3xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                    sm:p-8
                                "
                >
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                  >
                    Evidencias de campo
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                  >
                    Comparación del estado antes y después de la intervención.
                  </p>

                  <div
                    className="
                                        mt-6
                                        grid
                                        grid-cols-1
                                        gap-6
                                        lg:grid-cols-2
                                    "
                  >
                    <EvidenceGallery
                      title="Antes de la intervención"
                      evidences={beforeEvidences}
                      emptyMessage="No se registraron fotografías antes de la intervención."
                    />

                    <EvidenceGallery
                      title="Después de la intervención"
                      evidences={afterEvidences}
                      emptyMessage="No se registraron fotografías después de la intervención."
                    />
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Panel de acciones */}
          <aside
            className="
                        xl:sticky
                        xl:top-24
                        xl:self-start
                    "
          >
            <div
              className="
                            overflow-hidden
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
            >
              <div
                className="
                                bg-[#064E3B]
                                px-6
                                py-5
                                text-white
                            "
              >
                <p
                  className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-emerald-200
                                "
                >
                  Gestión del trabajo
                </p>

                <h2
                  className="
                                    mt-1
                                    text-xl
                                    font-bold
                                "
                >
                  Acciones disponibles
                </h2>

                <p
                  className="
                                    mt-2
                                    text-sm
                                    leading-relaxed
                                    text-white/70
                                "
                >
                  Continúa con la siguiente actividad según el estado del reporte.
                </p>
              </div>

              <div
                className="
                                space-y-4
                                p-5
                            "
              >
                {report.status === "ASSIGNED" && (
                  <ActionButton
                    title="Iniciar traslado"
                    description="Confirma que te diriges hacia la ubicación del reporte."
                    icon="→"
                    disabled={submitting}
                    onClick={() => void updateStatus("IN_TRANSIT")}
                  />
                )}

                {report.status === "IN_TRANSIT" && (
                  <ActionButton
                    title="Iniciar atención"
                    description="Indica que ya llegaste o que la intervención está comenzando."
                    icon="✓"
                    disabled={submitting}
                    onClick={() => void updateStatus("IN_PROGRESS")}
                  />
                )}

                {report.status === "IN_PROGRESS" && (
                  <>
                    <ActionButton
                      title="Atender reporte"
                      description="Registra la verificación, los datos encontrados y la acción realizada."
                      icon="1"
                      onClick={() => navigate(`/technician/reports/${report.id}/attend`)}
                    />

                    <ActionButton
                      title="Evidencia y trazabilidad"
                      description="Registra llegada, ubicación y fotografías de campo."
                      icon="2"
                      variant="secondary"
                      onClick={() => navigate(`/technician/reports/${report.id}/fieldwork`)}
                    />

                    <ActionButton
                      title="Cerrar intervención"
                      description="Registra el resultado técnico final y resuelve el reporte."
                      icon="3"
                      variant="dark"
                      onClick={() => navigate(`/technician/reports/${report.id}/closure`)}
                    />
                  </>
                )}

                {report.status === "RESOLVED" && (
                  <div
                    className="
                                        rounded-2xl
                                        border
                                        border-emerald-200
                                        bg-emerald-50
                                        p-5
                                    "
                  >
                    <div
                      className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                    >
                      <span
                        className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-emerald-600
                                                font-bold
                                                text-white
                                            "
                      >
                        ✓
                      </span>

                      <div>
                        <p
                          className="
                                                    text-sm
                                                    font-bold
                                                    text-emerald-800
                                                "
                        >
                          Trabajo finalizado
                        </p>

                        <p
                          className="
                                                    mt-1
                                                    text-xs
                                                    leading-relaxed
                                                    text-emerald-700
                                                "
                        >
                          La intervención ya cuenta con estado resuelto.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!["ASSIGNED", "IN_TRANSIT", "IN_PROGRESS", "RESOLVED"].includes(report.status) && (
                  <div
                    className="
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-5
                                    "
                  >
                    <p
                      className="
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                    >
                      Sin acciones disponibles
                    </p>

                    <p
                      className="
                                            mt-1
                                            text-xs
                                            leading-relaxed
                                            text-slate-500
                                        "
                    >
                      El estado actual del reporte no permite realizar acciones técnicas.
                    </p>
                  </div>
                )}

                {submitting && (
                  <div
                    className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            bg-slate-50
                                            px-4
                                            py-3
                                            text-sm
                                            text-slate-600
                                        "
                    role="status"
                  >
                    <div
                      className="
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-slate-200
                                            border-t-emerald-600
                                        "
                    />
                    Actualizando estado...
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ActionButton({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  variant = "primary",
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "dark";
}) {
  const styles = {
    primary: "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700",

    secondary: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",

    dark: "border-[#064E3B] bg-[#064E3B] text-white hover:bg-[#033D2E]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
                w-full
                rounded-2xl
                border
                p-4
                text-left
                transition
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${styles[variant]}
            `}
    >
      <div
        className="
                flex
                items-start
                gap-3
            "
      >
        <span
          className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/15
                    text-sm
                    font-bold
                "
        >
          {icon}
        </span>

        <div>
          <p
            className="
                        text-sm
                        font-bold
                    "
          >
            {title}
          </p>

          <p
            className="
                        mt-1
                        text-xs
                        leading-relaxed
                        opacity-80
                    "
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

function EvidenceGallery({
  title,
  evidences,
  emptyMessage,
}: {
  title: string;
  evidences: {
    id: string;
    imageUrl: string;
  }[];
  emptyMessage: string;
}) {
  return (
    <div
      className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4
        "
    >
      <div
        className="
                mb-4
                flex
                items-center
                justify-between
                gap-3
            "
      >
        <p
          className="
                    font-semibold
                    text-slate-800
                "
        >
          {title}
        </p>

        <span
          className="
                    rounded-full
                    bg-white
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-slate-500
                "
        >
          {evidences.length} foto
          {evidences.length === 1 ? "" : "s"}
        </span>
      </div>

      {evidences.length > 0 ? (
        <div
          className="
                    grid
                    grid-cols-2
                    gap-3
                "
        >
          {evidences.map((evidence) => (
            <a
              key={evidence.id}
              href={evidence.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                                    group
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                "
            >
              <img
                src={evidence.imageUrl}
                alt={title}
                className="
                                        h-32
                                        w-full
                                        object-cover
                                        transition
                                        duration-300
                                        group-hover:scale-105
                                    "
              />
            </a>
          ))}
        </div>
      ) : (
        <div
          className="
                    flex
                    min-h-36
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    px-5
                    text-center
                "
        >
          <div
            className="
                        text-slate-300
                    "
          >
            <EmptyImageIcon />
          </div>

          <p
            className="
                        mt-2
                        text-xs
                        leading-relaxed
                        text-slate-500
                    "
          >
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
}
