import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { statusLabels } from "../utils/reportLabels";

import { TechnicalClosureService } from "../services/technicalClosure.service";

import { OperationalCatalogService } from "../services/operationalCatalog.service";

import type { ClosureReason } from "../services/operationalCatalog.service";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Report = {
  id: string;
  title: string;
  problemType: string;
  description: string;
  status: string;
  address?: string;
  priority?: string;
  evidences?: {
    imageUrl: string;
  }[];
  municipality?: {
    id: string;
    name: string;
  } | null;
  fieldWork?: {
    arrivedAt?: string | null;
    closedAt?: string | null;
    notes?: string | null;
    distanceMeters?: number | null;
    evidences: {
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
};

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxWidth = 1000;

        const scale = Math.min(1, maxWidth / image.width);

        const canvas = document.createElement("canvas");

        canvas.width = image.width * scale;

        canvas.height = image.height * scale;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("No se pudo procesar la imagen."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };

      image.onerror = () => reject(new Error("No se pudo cargar la imagen."));

      image.src = String(reader.result);
    };

    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));

    reader.readAsDataURL(file);
  });
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "No registrado";
  }

  return new Date(value).toLocaleString();
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M5 12.5l4 4L19 6.5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 7.5h3l1.5-2h7l1.5 2h3a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2z"
      />
      <circle cx="12" cy="13" r="3.25" strokeWidth={1.8} />
    </svg>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
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
        {value}
      </p>
    </div>
  );
}

function RequirementItem({ complete, label }: { complete: boolean; label: string }) {
  return (
    <div
      className="
            flex
            items-center
            gap-3
        "
    >
      <span
        className={`
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                ${
                  complete
                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border-slate-200 bg-slate-100 text-slate-400"
                }
            `}
      >
        {complete && (
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 12.5l4 4L19 6.5"
            />
          </svg>
        )}
      </span>

      <span
        className={`
                text-sm
                ${complete ? "font-medium text-emerald-800" : "text-slate-500"}
            `}
      >
        {label}
      </span>
    </div>
  );
}

function EvidenceGroup({
  title,
  evidences,
}: {
  title: string;
  evidences: {
    id: string;
    imageUrl: string;
  }[];
}) {
  return (
    <div>
      <div
        className="
                mb-3
                flex
                items-center
                justify-between
                gap-3
            "
      >
        <p
          className="
                    text-sm
                    font-semibold
                    text-slate-700
                "
        >
          {title}
        </p>

        <span
          className="
                    rounded-full
                    bg-slate-100
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-slate-500
                "
        >
          {evidences.length}
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
                                bg-slate-100
                            "
            >
              <img
                src={evidence.imageUrl}
                alt={title}
                className="
                                    h-28
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
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-5
                    text-center
                    text-xs
                    text-slate-400
                "
        >
          No se registraron evidencias.
        </div>
      )}
    </div>
  );
}

export default function TechnicianClosurePage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [report, setReport] = useState<Report | null>(null);

  const [selectedClosureReasonId, setSelectedClosureReasonId] = useState("");

  const [selectedResult, setSelectedResult] = useState("");

  const [observations, setObservations] = useState("");

  const [followUpNotes, setFollowUpNotes] = useState("");

  const [closureEvidenceUrl, setClosureEvidenceUrl] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [closureReasons, setClosureReasons] = useState<ClosureReason[]>([]);

  const [loadingReasons, setLoadingReasons] = useState(true);

  const technicianId = localStorage.getItem("userId") || "";

  const latestAttention = useMemo(() => {
    return report?.technicalAttentions?.[0];
  }, [report]);

  const selectedClosureReason = useMemo(() => {
    return closureReasons.find((reason) => reason.id === selectedClosureReasonId);
  }, [closureReasons, selectedClosureReasonId]);

  const requiresFollowUp = useMemo(() => {
    if (!selectedClosureReason) {
      return false;
    }

    const value = selectedClosureReason.name
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return value.includes("SEGUIMIENTO");
  }, [selectedClosureReason]);

  const beforeEvidences =
    report?.fieldWork?.evidences?.filter((evidence) => evidence.phase === "BEFORE") || [];

  const afterEvidences =
    report?.fieldWork?.evidences?.filter((evidence) => evidence.phase === "AFTER") || [];

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/reports/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "No se pudo cargar el reporte.");
        }

        setReport(data);
      } catch (error: any) {
        setError(error.message || "No se pudo cargar el cierre técnico.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  useEffect(() => {
    const loadClosureReasons = async () => {
      try {
        setLoadingReasons(true);

        const data = await OperationalCatalogService.getActiveClosureReasons();

        setClosureReasons(data);
      } catch (error) {
        console.error("No se pudieron cargar los motivos de cierre.", error);
      } finally {
        setLoadingReasons(false);
      }
    };

    loadClosureReasons();
  }, []);

  const handleEvidenceChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setError("");

      const imageUrl = await fileToBase64(file);

      setClosureEvidenceUrl(imageUrl);
    } catch (error: any) {
      setError(error.message || "No se pudo cargar la evidencia de cierre.");
    } finally {
      event.target.value = "";
    }
  };

  const canSubmit =
    selectedClosureReasonId &&
    selectedResult.trim() &&
    observations.trim() &&
    (!requiresFollowUp || followUpNotes.trim()) &&
    !saving;

  const closureRequirements = {
    reason: Boolean(selectedClosureReasonId),

    observations: Boolean(observations.trim()),

    followUp: !requiresFollowUp || Boolean(followUpNotes.trim()),
  };

  const completedRequirements = Object.values(closureRequirements).filter(Boolean).length;

  const completionPercentage = Math.round((completedRequirements / 3) * 100);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id || !report) {
      return;
    }

    if (!technicianId) {
      setError("No se encontró el técnico en sesión.");
      return;
    }

    if (!canSubmit) {
      setError("Completa el resultado técnico y las observaciones de cierre.");
      return;
    }

    const confirmed = window.confirm(
      "¿Deseas registrar el cierre operativo? El reporte pasará a Resuelto."
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");
      await TechnicalClosureService.createClosure({
        reportId: id,

        technicianId,

        result: selectedResult,

        closureReasonId: selectedClosureReasonId,

        observations,

        closureEvidenceUrl: closureEvidenceUrl || undefined,

        followUpNotes: followUpNotes || undefined,
      });

      setSuccessMessage("Cierre técnico registrado correctamente.");

      setTimeout(() => {
        navigate(`/technician/reports/${id}`);
      }, 1000);
    } catch (error: any) {
      setError(error.message || "No se pudo registrar el cierre técnico.");
    } finally {
      setSaving(false);
    }
  };

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
            Cargando cierre operativo
          </p>

          <p
            className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
          >
            Recuperando la atención y las evidencias registradas.
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
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                        text-xl
                        font-bold
                        text-red-600
                    "
          >
            !
          </div>

          <h1
            className="
                        mt-4
                        text-xl
                        font-bold
                        text-slate-900
                    "
          >
            Reporte no encontrado
          </h1>

          <p
            className="
                        mt-2
                        text-sm
                        leading-relaxed
                        text-slate-500
                    "
          >
            {error || "No se pudo recuperar la información necesaria para realizar el cierre."}
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
            onClick={() => navigate(`/technician/reports/${report.id}/fieldwork`)}
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
            Volver a trazabilidad
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
              Cierre técnico
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
                        lg:grid-cols-[minmax(0,1fr)_380px]
                    "
          >
            <div
              className="
                            p-6
                            sm:p-8
                            lg:p-10
                        "
            >
              <span
                className="
                                inline-flex
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
                Cierre operativo
              </span>

              <h1
                className="
                                mt-5
                                max-w-4xl
                                text-3xl
                                font-bold
                                leading-tight
                                tracking-tight
                                text-slate-950
                                sm:text-4xl
                                lg:text-5xl
                            "
              >
                Registrar resultado técnico
              </h1>

              <p
                className="
                                mt-4
                                max-w-3xl
                                text-base
                                leading-7
                                text-slate-500
                                sm:text-lg
                            "
              >
                Selecciona el resultado final, registra las observaciones y confirma el cierre
                operativo del reporte.
              </p>
            </div>

            <div
              className="
                            border-t
                            border-slate-200
                            bg-[#064E3B]
                            p-6
                            text-white
                            lg:border-l
                            lg:border-t-0
                            lg:p-8
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
                Reporte a cerrar
              </p>

              <h2
                className="
                                mt-3
                                text-xl
                                font-bold
                                leading-snug
                            "
              >
                {report.title}
              </h2>

              <p
                className="
                                mt-2
                                text-sm
                                text-white/65
                            "
              >
                {report.problemType}
              </p>

              <div
                className="
                                mt-6
                                grid
                                grid-cols-2
                                gap-3
                            "
              >
                <div
                  className="
                                    rounded-xl
                                    bg-white/10
                                    p-3
                                "
                >
                  <p
                    className="
                                        text-xs
                                        uppercase
                                        tracking-wide
                                        text-white/45
                                    "
                  >
                    Estado
                  </p>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                    "
                  >
                    {statusLabels[report.status] || report.status}
                  </p>
                </div>

                <div
                  className="
                                    rounded-xl
                                    bg-white/10
                                    p-3
                                "
                >
                  <p
                    className="
                                        text-xs
                                        uppercase
                                        tracking-wide
                                        text-white/45
                                    "
                  >
                    Prioridad
                  </p>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                    "
                  >
                    {report.priority || "No definida"}
                  </p>
                </div>
              </div>

              <div
                className="
                                mt-3
                                rounded-xl
                                bg-white/10
                                p-3
                            "
              >
                <p
                  className="
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-white/45
                                "
                >
                  Municipalidad
                </p>

                <p
                  className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    leading-relaxed
                                "
                >
                  {report.municipality?.name || "No definida"}
                </p>
              </div>
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
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
          >
            <div>
              <h2
                className="
                                text-lg
                                font-bold
                                text-slate-900
                            "
              >
                Preparación del cierre
              </h2>

              <p
                className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
              >
                {completedRequirements} de 3 requisitos completados.
              </p>
            </div>

            <span
              className="
                            text-2xl
                            font-bold
                            text-emerald-700
                        "
            >
              {completionPercentage}%
            </span>
          </div>

          <div
            className="
                        mt-4
                        h-2.5
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                    "
          >
            <div
              className="
                                h-full
                                rounded-full
                                bg-emerald-600
                                transition-all
                                duration-500
                            "
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="
                            mt-6
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
            <span
              className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-red-100
                            font-bold
                        "
            >
              !
            </span>

            <div>
              <p className="font-semibold">No se pudo completar la operación</p>

              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="
                            mt-6
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-5
                            py-4
                            text-sm
                            text-emerald-700
                        "
          >
            <span
              className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-600
                            text-white
                        "
            >
              <CheckIcon />
            </span>

            <div>
              <p className="font-semibold">Cierre registrado</p>

              <p className="mt-1">{successMessage}</p>
            </div>
          </div>
        )}

        <div
          className="
                    mt-6
                    grid
                    grid-cols-1
                    gap-6
                    xl:grid-cols-[minmax(0,1fr)_340px]
                "
        >
          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="
                            min-w-0
                            space-y-6
                        "
          >
            {/* Resultado */}
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
                                flex
                                items-start
                                gap-4
                            "
              >
                <span
                  className={`
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-sm
                                    font-bold
                                    ${
                                      selectedClosureReasonId
                                        ? "bg-emerald-600 text-white"
                                        : "bg-[#064E3B] text-white"
                                    }
                                `}
                >
                  {selectedClosureReasonId ? "✓" : "1"}
                </span>

                <div>
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        sm:text-2xl
                                    "
                  >
                    Resultado técnico final
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Selecciona el motivo que representa el resultado final de la intervención.
                  </p>
                </div>
              </div>

              <div
                className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
              >
                {loadingReasons ? (
                  <div
                    className="
                                        md:col-span-2
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-5
                                        text-sm
                                        text-slate-500
                                    "
                  >
                    <div
                      className="
                                            h-5
                                            w-5
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-slate-200
                                            border-t-emerald-600
                                        "
                    />
                    Cargando resultados técnicos...
                  </div>
                ) : closureReasons.length === 0 ? (
                  <div
                    className="
                                        md:col-span-2
                                        rounded-2xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        p-5
                                        text-sm
                                        font-semibold
                                        text-red-700
                                    "
                  >
                    No existen resultados técnicos activos configurados.
                  </div>
                ) : (
                  closureReasons.map((reason) => {
                    const selected = selectedClosureReasonId === reason.id;

                    return (
                      <label
                        key={reason.id}
                        className={`
                                                        relative
                                                        cursor-pointer
                                                        rounded-2xl
                                                        border-2
                                                        p-5
                                                        transition
                                                        ${
                                                          selected
                                                            ? "border-emerald-600 bg-emerald-50 shadow-sm"
                                                            : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50"
                                                        }
                                                    `}
                      >
                        <input
                          type="radio"
                          name="result"
                          value={reason.id}
                          checked={selected}
                          onChange={() => {
                            setSelectedClosureReasonId(reason.id);

                            setSelectedResult(reason.name);
                          }}
                          className="
                                                            sr-only
                                                        "
                        />

                        <div
                          className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    "
                        >
                          <span
                            className={`
                                                            mt-0.5
                                                            flex
                                                            h-6
                                                            w-6
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border-2
                                                            ${
                                                              selected
                                                                ? "border-emerald-600 bg-emerald-600"
                                                                : "border-slate-300 bg-white"
                                                            }
                                                        `}
                          >
                            {selected && (
                              <span
                                className="
                                                                    h-2.5
                                                                    w-2.5
                                                                    rounded-full
                                                                    bg-white
                                                                "
                              />
                            )}
                          </span>

                          <div className="min-w-0">
                            <p
                              className={`
                                                                font-semibold
                                                                leading-snug
                                                                ${
                                                                  selected
                                                                    ? "text-emerald-900"
                                                                    : "text-slate-900"
                                                                }
                                                            `}
                            >
                              {reason.name}
                            </p>

                            <p
                              className="
                                                                mt-2
                                                                text-sm
                                                                leading-relaxed
                                                                text-slate-500
                                                            "
                            >
                              {reason.description || "Sin descripción."}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </section>

            {/* Seguimiento */}
            {requiresFollowUp && (
              <section
                className="
                                rounded-3xl
                                border
                                border-amber-200
                                bg-amber-50
                                p-6
                                shadow-sm
                                sm:p-8
                            "
              >
                <div
                  className="
                                    flex
                                    items-start
                                    gap-4
                                "
                >
                  <span
                    className={`
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-sm
                                        font-bold
                                        ${
                                          followUpNotes.trim()
                                            ? "bg-emerald-600 text-white"
                                            : "bg-amber-500 text-white"
                                        }
                                    `}
                  >
                    {followUpNotes.trim() ? "✓" : "!"}
                  </span>

                  <div>
                    <h2
                      className="
                                            text-xl
                                            font-bold
                                            text-slate-900
                                        "
                    >
                      Seguimiento requerido
                    </h2>

                    <p
                      className="
                                            mt-1
                                            text-sm
                                            leading-relaxed
                                            text-amber-800
                                        "
                    >
                      El motivo seleccionado requiere indicar la actividad pendiente o una nueva
                      visita.
                    </p>
                  </div>
                </div>

                <textarea
                  value={followUpNotes}
                  onChange={(event) => setFollowUpNotes(event.target.value)}
                  placeholder="Describe la tarea complementaria, nueva visita o seguimiento requerido."
                  className="
                                        mt-6
                                        min-h-36
                                        w-full
                                        resize-y
                                        rounded-2xl
                                        border
                                        border-amber-300
                                        bg-white
                                        p-4
                                        text-sm
                                        leading-7
                                        text-slate-700
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-amber-500
                                        focus:ring-2
                                        focus:ring-amber-100
                                    "
                />

                <p
                  className="
                                    mt-2
                                    text-xs
                                    text-amber-700
                                "
                >
                  {followUpNotes.trim().length} caracteres
                </p>
              </section>
            )}

            {/* Observaciones */}
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
                                flex
                                items-start
                                gap-4
                            "
              >
                <span
                  className={`
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-sm
                                    font-bold
                                    ${
                                      observations.trim()
                                        ? "bg-emerald-600 text-white"
                                        : "bg-[#064E3B] text-white"
                                    }
                                `}
                >
                  {observations.trim() ? "✓" : "2"}
                </span>

                <div>
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        sm:text-2xl
                                    "
                  >
                    Observaciones de cierre
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Explica el motivo del cierre, las condiciones encontradas y las acciones
                    finales.
                  </p>
                </div>
              </div>

              <textarea
                value={observations}
                onChange={(event) => setObservations(event.target.value)}
                placeholder="Ejemplo: Se verificó la incidencia, se realizó la intervención correspondiente y se dejó el área en condiciones adecuadas..."
                className="
                                    mt-6
                                    min-h-48
                                    w-full
                                    resize-y
                                    rounded-2xl
                                    border
                                    border-slate-300
                                    bg-white
                                    p-4
                                    text-sm
                                    leading-7
                                    text-slate-700
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-emerald-500
                                    focus:ring-2
                                    focus:ring-emerald-100
                                "
              />

              <div
                className="
                                mt-2
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
              >
                <span
                  className="
                                    text-xs
                                    text-slate-400
                                "
                >
                  Campo obligatorio
                </span>

                <span
                  className="
                                    text-xs
                                    text-slate-400
                                "
                >
                  {observations.trim().length} caracteres
                </span>
              </div>
            </section>

            {/* Evidencia */}
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
                                flex
                                items-start
                                gap-4
                            "
              >
                <span
                  className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#064E3B]
                                    text-sm
                                    font-bold
                                    text-white
                                "
                >
                  3
                </span>

                <div>
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        sm:text-2xl
                                    "
                  >
                    Evidencia de cierre
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Puedes adjuntar una fotografía adicional que sustente el cierre operativo.
                  </p>
                </div>
              </div>

              {!closureEvidenceUrl ? (
                <>
                  <label
                    htmlFor="closure-evidence"
                    className="
                                            mt-6
                                            flex
                                            min-h-40
                                            cursor-pointer
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border-2
                                            border-dashed
                                            border-emerald-200
                                            bg-emerald-50/50
                                            px-5
                                            text-center
                                            text-emerald-700
                                            transition
                                            hover:border-emerald-400
                                            hover:bg-emerald-50
                                        "
                  >
                    <CameraIcon />

                    <p
                      className="
                                            mt-3
                                            text-sm
                                            font-semibold
                                        "
                    >
                      Seleccionar fotografía
                    </p>

                    <p
                      className="
                                            mt-1
                                            text-xs
                                            text-emerald-700/70
                                        "
                    >
                      JPG, PNG o fotografía tomada desde el dispositivo
                    </p>
                  </label>

                  <input
                    id="closure-evidence"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleEvidenceChange}
                    className="sr-only"
                  />
                </>
              ) : (
                <div
                  className="
                                    mt-6
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                "
                >
                  <div
                    className="
                                        relative
                                    "
                  >
                    <img
                      src={closureEvidenceUrl}
                      alt="Evidencia de cierre"
                      className="
                                                h-72
                                                w-full
                                                object-cover
                                            "
                    />

                    <button
                      type="button"
                      onClick={() => setClosureEvidenceUrl("")}
                      className="
                                                absolute
                                                right-3
                                                top-3
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-red-600
                                                font-bold
                                                text-white
                                                shadow
                                                transition
                                                hover:bg-red-700
                                            "
                      aria-label="Eliminar evidencia de cierre"
                      title="Eliminar evidencia"
                    >
                      ×
                    </button>
                  </div>

                  <div
                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        px-5
                                        py-4
                                    "
                  >
                    <span
                      className="
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                    >
                      Evidencia preparada
                    </span>

                    <span
                      className="
                                            rounded-full
                                            bg-emerald-100
                                            px-3
                                            py-1
                                            text-xs
                                            font-semibold
                                            text-emerald-700
                                        "
                    >
                      Lista para enviar
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Acción final */}
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
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
              >
                <div>
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                  >
                    Confirmar cierre operativo
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Al confirmar, el reporte cambiará al estado Resuelto.
                  </p>
                </div>

                <span
                  className={`
                                    rounded-full
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    ${
                                      canSubmit
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-slate-100 text-slate-500"
                                    }
                                `}
                >
                  {canSubmit ? "Listo para cerrar" : "Faltan datos"}
                </span>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="
                                    mt-6
                                    w-full
                                    rounded-2xl
                                    bg-[#064E3B]
                                    px-5
                                    py-4
                                    text-base
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-[#033D2E]
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-300
                                    disabled:text-white
                                "
              >
                {saving ? "Registrando cierre..." : "Registrar cierre operativo"}
              </button>
            </section>
          </form>

          {/* Resumen lateral */}
          <aside
            className="
                        space-y-6
                        xl:sticky
                        xl:top-24
                        xl:self-start
                    "
          >
            <section
              className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
            >
              <h2
                className="
                                text-lg
                                font-bold
                                text-slate-900
                            "
              >
                Requisitos del cierre
              </h2>

              <p
                className="
                                mt-1
                                text-sm
                                leading-relaxed
                                text-slate-500
                            "
              >
                Completa los datos requeridos antes de confirmar.
              </p>

              <div
                className="
                                mt-5
                                space-y-4
                            "
              >
                <RequirementItem
                  complete={closureRequirements.reason}
                  label="Resultado técnico seleccionado"
                />

                <RequirementItem
                  complete={closureRequirements.observations}
                  label="Observaciones registradas"
                />

                <RequirementItem
                  complete={closureRequirements.followUp}
                  label={
                    requiresFollowUp
                      ? "Notas de seguimiento registradas"
                      : "No requiere seguimiento"
                  }
                />
              </div>
            </section>

            <section
              className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
            >
              <h2
                className="
                                text-lg
                                font-bold
                                text-slate-900
                            "
              >
                Resumen operativo
              </h2>

              <div
                className="
                                mt-5
                                grid
                                grid-cols-1
                                gap-3
                            "
              >
                <InfoItem label="Llegada" value={formatDateTime(report.fieldWork?.arrivedAt)} />

                <InfoItem
                  label="Cierre de visita"
                  value={formatDateTime(report.fieldWork?.closedAt)}
                />

                <InfoItem
                  label="Distancia"
                  value={
                    report.fieldWork?.distanceMeters !== null &&
                    report.fieldWork?.distanceMeters !== undefined
                      ? `${report.fieldWork.distanceMeters.toFixed(0)} metros`
                      : "No calculada"
                  }
                />

                <InfoItem
                  label="Notas de campo"
                  value={report.fieldWork?.notes || "Sin notas registradas"}
                />
              </div>
            </section>

            <section
              className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
            >
              <h2
                className="
                                text-lg
                                font-bold
                                text-slate-900
                            "
              >
                Atención técnica previa
              </h2>

              {latestAttention ? (
                <div
                  className="
                                    mt-5
                                    space-y-4
                                "
                >
                  <InfoItem label="Acción" value={latestAttention.actionTaken} />

                  <InfoItem label="Resultado preliminar" value={latestAttention.technicalResult} />

                  <InfoItem
                    label="Observaciones"
                    value={latestAttention.observations || "Sin observaciones"}
                  />
                </div>
              ) : (
                <div
                  className="
                                    mt-4
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-slate-200
                                    bg-slate-50
                                    p-5
                                    text-center
                                    text-sm
                                    text-slate-500
                                "
                >
                  No hay atención técnica previa registrada.
                </div>
              )}
            </section>

            <section
              className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
            >
              <h2
                className="
                                text-lg
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
                                leading-relaxed
                                text-slate-500
                            "
              >
                Fotografías registradas durante la trazabilidad.
              </p>

              <div
                className="
                                mt-5
                                space-y-6
                            "
              >
                <EvidenceGroup title="Antes" evidences={beforeEvidences} />

                <EvidenceGroup title="Después" evidences={afterEvidences} />
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
