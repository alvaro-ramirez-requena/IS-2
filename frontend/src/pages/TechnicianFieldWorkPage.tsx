import { useEffect, useMemo, useState } from "react";

import type { ChangeEvent } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { FieldWorkService } from "../services/fieldwork.service";

import type { FieldWork, EvidencePhase } from "../services/fieldwork.service";

import { statusLabels } from "../utils/reportLabels";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Report = {
  id: string;
  title: string;
  problemType: string;
  description: string;
  status: string;
  address?: string;
  priority?: string;
  latitude?: number;
  longitude?: number;

  evidences?: {
    imageUrl: string;
  }[];

  municipality?: {
    id: string;
    name: string;
  } | null;
};

const priorityStyles: Record<string, string> = {
  ALTO: "border-red-200 bg-red-50 text-red-700",

  MEDIO: "border-amber-200 bg-amber-50 text-amber-700",

  BAJO: "border-emerald-200 bg-emerald-50 text-emerald-700",
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

function getPriorityStyle(priority?: string) {
  return (
    priorityStyles[priority?.toUpperCase() || ""] || "border-slate-200 bg-slate-50 text-slate-700"
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

function StepNumber({ number, complete }: { number: number; complete: boolean }) {
  return (
    <div
      className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            text-sm
            font-bold
            ${complete ? "bg-emerald-600 text-white" : "bg-[#064E3B] text-white"}
        `}
    >
      {complete ? <CheckIcon /> : number}
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

export default function TechnicianFieldWorkPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [report, setReport] = useState<Report | null>(null);

  const [fieldWork, setFieldWork] = useState<FieldWork | null>(null);

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [online, setOnline] = useState(navigator.onLine);

  const technicianId = localStorage.getItem("userId") || "";

  const localDraftKey = `fieldwork-draft-${id}`;

  useEffect(() => {
    const handleOnline = () => setOnline(true);

    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);

      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const beforeEvidences = useMemo(() => {
    return fieldWork?.evidences?.filter((evidence) => evidence.phase === "BEFORE") || [];
  }, [fieldWork]);

  const afterEvidences = useMemo(() => {
    return fieldWork?.evidences?.filter((evidence) => evidence.phase === "AFTER") || [];
  }, [fieldWork]);

  const hasLocalDraft = Boolean(localStorage.getItem(localDraftKey));

  const requirements = useMemo(
    () => ({
      started: Boolean(fieldWork),

      arrival: Boolean(fieldWork?.arrivedAt),

      notes: Boolean(fieldWork?.notes?.trim()),

      beforePhoto: beforeEvidences.length > 0,

      afterPhoto: afterEvidences.length > 0,

      closed: Boolean(fieldWork?.closedAt),
    }),
    [fieldWork, beforeEvidences, afterEvidences]
  );

  const completedRequirements = [
    requirements.started,
    requirements.arrival,
    requirements.notes,
    requirements.beforePhoto,
    requirements.afterPhoto,
  ].filter(Boolean).length;

  const progressPercentage = Math.round((completedRequirements / 5) * 100);

  const canClose =
    requirements.started &&
    requirements.arrival &&
    notes.trim().length > 0 &&
    requirements.beforePhoto &&
    requirements.afterPhoto &&
    !requirements.closed;

  const loadData = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const reportResponse = await fetch(`${API_URL}/api/reports/${id}`);

      const reportData = await reportResponse.json();

      if (!reportResponse.ok) {
        throw new Error(reportData?.message || "No se pudo cargar el reporte.");
      }

      setReport(reportData);

      const currentFieldWork = await FieldWorkService.getByReport(id);

      setFieldWork(currentFieldWork);

      if (currentFieldWork?.notes) {
        setNotes(currentFieldWork.notes);
      } else {
        const localDraft = localStorage.getItem(localDraftKey);

        if (localDraft) {
          setNotes(localDraft);
        }
      }
    } catch (error: any) {
      setError(error.message || "No se pudo cargar la trazabilidad.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [id]);

  const handleStart = async () => {
    if (!id || !technicianId) {
      setError("No se encontró el técnico en sesión.");

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const result = await FieldWorkService.start(id, technicianId);

      setFieldWork(result);

      setSuccessMessage("Trazabilidad iniciada correctamente.");
    } catch (error: any) {
      setError(error.message || "No se pudo iniciar la trazabilidad.");
    } finally {
      setSaving(false);
    }
  };

  const handleArrival = async () => {
    if (!id || !technicianId) {
      setError("No se encontró el técnico en sesión.");

      return;
    }

    if (!navigator.geolocation) {
      setError("El navegador no permite obtener ubicación.");

      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await FieldWorkService.registerArrival({
            reportId: id,

            technicianId,

            arrivalLat: position.coords.latitude,

            arrivalLng: position.coords.longitude,
          });

          setFieldWork(result);

          setSuccessMessage("Llegada registrada correctamente.");
        } catch (error: any) {
          setError(error.message || "No se pudo registrar la llegada.");
        } finally {
          setSaving(false);
        }
      },

      () => {
        setSaving(false);

        setError("No se pudo obtener tu ubicación actual.");
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,
      }
    );
  };

  const handleSaveNotes = async () => {
    if (!id) {
      return;
    }

    if (!notes.trim()) {
      setError("Las notas de trabajo son obligatorias.");

      return;
    }

    if (!online) {
      localStorage.setItem(localDraftKey, notes);

      setSuccessMessage("Sin conexión: las notas se guardaron localmente.");

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const result = await FieldWorkService.saveNotes(id, notes);

      setFieldWork(result);

      localStorage.removeItem(localDraftKey);

      setSuccessMessage("Notas guardadas correctamente.");
    } catch (error: any) {
      setError(error.message || "No se pudieron guardar las notas.");
    } finally {
      setSaving(false);
    }
  };

  const handleEvidenceUpload = async (
    event: ChangeEvent<HTMLInputElement>,

    phase: EvidencePhase
  ) => {
    if (!id || !technicianId) {
      setError("No se encontró el técnico en sesión.");

      event.target.value = "";

      return;
    }

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const imageUrl = await fileToBase64(file);

      const result = await FieldWorkService.addEvidence({
        reportId: id,

        technicianId,

        imageUrl,

        phase,
      });

      setFieldWork(result);

      setSuccessMessage(
        phase === "BEFORE"
          ? "Foto del estado inicial registrada."
          : "Foto del estado final registrada."
      );
    } catch (error: any) {
      setError(error.message || "No se pudo registrar la evidencia.");
    } finally {
      setSaving(false);

      event.target.value = "";
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    const confirmed = window.confirm("¿Deseas quitar esta fotografía?");

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const result = await FieldWorkService.deleteEvidence(evidenceId);

      setFieldWork(result);

      setSuccessMessage("Evidencia eliminada correctamente.");
    } catch (error: any) {
      setError(error.message || "No se pudo eliminar la evidencia.");
    } finally {
      setSaving(false);
    }
  };

  const handleSyncLocalNotes = async () => {
    if (!id) {
      return;
    }

    const localDraft = localStorage.getItem(localDraftKey);

    if (!localDraft) {
      setError("No hay notas locales pendientes.");

      return;
    }

    if (!online) {
      setError("Necesitas conexión para sincronizar las notas.");

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const result = await FieldWorkService.saveNotes(id, localDraft);

      setFieldWork(result);
      setNotes(localDraft);

      localStorage.removeItem(localDraftKey);

      setSuccessMessage("Notas locales sincronizadas correctamente.");
    } catch (error: any) {
      setError(error.message || "No se pudieron sincronizar las notas.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async () => {
    if (!id) {
      return;
    }

    if (!canClose) {
      setError("Completa la llegada, las notas y las fotografías antes y después.");

      return;
    }

    const confirmed = window.confirm(
      "¿Deseas cerrar el trabajo de campo? Luego registrarás el resultado técnico final."
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      await FieldWorkService.close(id);

      setSuccessMessage("Trabajo de campo finalizado. Continuando al cierre técnico.");

      setTimeout(() => {
        navigate(`/technician/reports/${id}/closure`);
      }, 1000);
    } catch (error: any) {
      setError(error.message || "No se pudo cerrar el trabajo de campo.");
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
            Cargando trabajo de campo
          </p>

          <p
            className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
          >
            Recuperando trazabilidad y evidencias.
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
                        text-xl
                        text-red-600
                    "
          >
            !
          </div>

          <h1
            className="
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
                        text-slate-500
                    "
          >
            {error || "No se pudo recuperar la información solicitada."}
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

  const initialEvidence = report.evidences?.[0]?.imageUrl;

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
            onClick={() => navigate(`/technician/reports/${report.id}`)}
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
            ← Volver al detalle
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
              Trabajo de campo
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
        {/* Cabecera */}
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
                        lg:grid-cols-[1fr_380px]
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
                  Evidencia y trazabilidad
                </span>

                <span
                  className={`
                                    rounded-full
                                    border
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    ${
                                      online
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-red-200 bg-red-50 text-red-700"
                                    }
                                `}
                >
                  {online ? "● En línea" : "● Sin conexión"}
                </span>
              </div>

              <h1
                className="
                                mt-5
                                text-3xl
                                font-bold
                                leading-tight
                                tracking-tight
                                text-slate-950
                                sm:text-4xl
                                lg:text-5xl
                            "
              >
                Trabajo de campo
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
                Registra tu llegada, las observaciones y las evidencias antes y después de la
                intervención.
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
                  className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                >
                  {statusLabels[report.status] || report.status}
                </span>

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
                  Prioridad: {report.priority || "No definida"}
                </span>
              </div>
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
                Reporte actual
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
                                text-white/70
                            "
              >
                {report.problemType}
              </p>

              <div
                className="
                                mt-6
                                space-y-3
                                text-sm
                            "
              >
                <div>
                  <p className="text-white/50">Municipalidad</p>

                  <p
                    className="
                                        mt-1
                                        font-medium
                                    "
                  >
                    {report.municipality?.name || "No definida"}
                  </p>
                </div>

                <div>
                  <p className="text-white/50">Dirección</p>

                  <p
                    className="
                                        mt-1
                                        leading-relaxed
                                    "
                  >
                    {report.address || "No registrada"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Barra de progreso */}
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
                Avance del registro
              </h2>

              <p
                className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
              >
                {completedRequirements} de 5 requisitos completados.
              </p>
            </div>

            <span
              className="
                            text-2xl
                            font-bold
                            text-emerald-700
                        "
            >
              {progressPercentage}%
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
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="
                            mt-6
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
            <p className="font-semibold">No se pudo completar la operación</p>

            <p className="mt-1">{error}</p>
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
                            mt-0.5
                            flex
                            h-6
                            w-6
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
              <p className="font-semibold">Operación realizada</p>

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
          {/* Pasos principales */}
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
                                flex
                                items-start
                                gap-4
                            "
              >
                <StepNumber number={1} complete={requirements.started} />

                <div className="min-w-0">
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                  >
                    Iniciar trazabilidad
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Crea el registro donde se almacenarán la llegada, las notas y las evidencias.
                  </p>
                </div>
              </div>

              <div
                className="
                                mt-6
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-5
                            "
              >
                {fieldWork ? (
                  <div
                    className="
                                        flex
                                        items-start
                                        gap-3
                                    "
                  >
                    <div
                      className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-emerald-100
                                            text-emerald-700
                                        "
                    >
                      <CheckIcon />
                    </div>

                    <div>
                      <p
                        className="
                                                text-sm
                                                font-semibold
                                                text-emerald-800
                                            "
                      >
                        Trazabilidad iniciada
                      </p>

                      <p
                        className="
                                                mt-1
                                                text-xs
                                                leading-relaxed
                                                text-slate-500
                                            "
                      >
                        Ya puedes registrar tu llegada, notas y fotografías.
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={saving}
                    className="
                                            w-full
                                            rounded-xl
                                            bg-emerald-600
                                            px-5
                                            py-3.5
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-emerald-700
                                            disabled:cursor-not-allowed
                                            disabled:bg-slate-300
                                        "
                  >
                    {saving ? "Iniciando..." : "Iniciar trazabilidad"}
                  </button>
                )}
              </div>
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
                                flex
                                items-start
                                gap-4
                            "
              >
                <StepNumber number={2} complete={requirements.arrival} />

                <div>
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                  >
                    Registrar llegada
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Confirma tu llegada utilizando la ubicación actual del dispositivo.
                  </p>
                </div>
              </div>

              <div
                className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                            "
              >
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
                    Hora de llegada
                  </p>

                  <p
                    className="
                                        mt-2
                                        text-sm
                                        font-semibold
                                        text-slate-800
                                    "
                  >
                    {formatDateTime(fieldWork?.arrivedAt)}
                  </p>
                </div>

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
                    Distancia al reporte
                  </p>

                  <p
                    className="
                                        mt-2
                                        text-sm
                                        font-semibold
                                        text-slate-800
                                    "
                  >
                    {fieldWork?.distanceMeters !== null && fieldWork?.distanceMeters !== undefined
                      ? `${fieldWork.distanceMeters.toFixed(0)} metros`
                      : "No calculada"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleArrival}
                disabled={saving || !fieldWork || Boolean(fieldWork.arrivedAt)}
                className="
                                    mt-5
                                    w-full
                                    rounded-xl
                                    bg-emerald-600
                                    px-5
                                    py-3.5
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-emerald-700
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-300
                                "
              >
                {fieldWork?.arrivedAt ? "Llegada registrada" : "Registrar llegada con ubicación"}
              </button>
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
                                flex
                                items-start
                                gap-4
                            "
              >
                <StepNumber number={3} complete={requirements.notes} />

                <div>
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                  >
                    Notas de trabajo
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Describe hallazgos, acciones realizadas, incidencias y coordinaciones.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <textarea
                  value={notes}
                  onChange={(event) => {
                    setNotes(event.target.value);

                    localStorage.setItem(localDraftKey, event.target.value);
                  }}
                  placeholder="Ejemplo: Se verificó la fuente del problema, se coordinó con el responsable y se aplicaron medidas preventivas..."
                  className="
                                        min-h-44
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
                                    flex-wrap
                                    items-center
                                    justify-between
                                    gap-2
                                "
                >
                  <span
                    className="
                                        text-xs
                                        text-slate-400
                                    "
                  >
                    {notes.trim().length} caracteres
                  </span>

                  {hasLocalDraft && (
                    <span
                      className="
                                            rounded-full
                                            bg-amber-50
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            text-amber-700
                                        "
                    >
                      Borrador local disponible
                    </span>
                  )}
                </div>
              </div>

              <div
                className="
                                mt-5
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                            "
              >
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={saving || !fieldWork || !notes.trim()}
                  className="
                                        flex-1
                                        rounded-xl
                                        bg-emerald-600
                                        px-5
                                        py-3.5
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-emerald-700
                                        disabled:cursor-not-allowed
                                        disabled:bg-slate-300
                                    "
                >
                  Guardar notas
                </button>

                <button
                  type="button"
                  onClick={handleSyncLocalNotes}
                  disabled={saving || !online || !hasLocalDraft}
                  className="
                                        flex-1
                                        rounded-xl
                                        border
                                        border-emerald-200
                                        bg-emerald-50
                                        px-5
                                        py-3.5
                                        font-semibold
                                        text-emerald-700
                                        transition
                                        hover:bg-emerald-100
                                        disabled:cursor-not-allowed
                                        disabled:border-slate-200
                                        disabled:bg-slate-100
                                        disabled:text-slate-400
                                    "
                >
                  Sincronizar borrador
                </button>
              </div>
            </section>

            <div
              className="
                            grid
                            grid-cols-1
                            gap-6
                            lg:grid-cols-2
                        "
            >
              <EvidenceUploader
                number={4}
                title="Fotos antes"
                description="Registra el estado inicial del problema antes de intervenir."
                phase="BEFORE"
                evidences={beforeEvidences}
                disabled={!fieldWork || saving}
                complete={requirements.beforePhoto}
                onUpload={handleEvidenceUpload}
                onDelete={handleDeleteEvidence}
              />

              <EvidenceUploader
                number={5}
                title="Fotos después"
                description="Registra cómo quedó el lugar luego de la intervención."
                phase="AFTER"
                evidences={afterEvidences}
                disabled={!fieldWork || saving}
                complete={requirements.afterPhoto}
                onUpload={handleEvidenceUpload}
                onDelete={handleDeleteEvidence}
              />
            </div>

            <section
              className={`
                            rounded-3xl
                            border
                            p-6
                            shadow-sm
                            sm:p-8
                            ${
                              canClose || requirements.closed
                                ? "border-emerald-200 bg-emerald-50/40"
                                : "border-slate-200 bg-white"
                            }
                        `}
            >
              <div
                className="
                                flex
                                items-start
                                gap-4
                            "
              >
                <StepNumber number={6} complete={requirements.closed} />

                <div>
                  <h2
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                  >
                    Cierre del trabajo de campo
                  </h2>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Finaliza el registro y continúa con el resultado técnico.
                  </p>
                </div>
              </div>

              <div
                className="
                                mt-6
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
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
                  Hora de cierre
                </p>

                <p
                  className="
                                    mt-2
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                "
                >
                  {formatDateTime(fieldWork?.closedAt)}
                </p>
              </div>

              {!canClose && !requirements.closed && (
                <p
                  className="
                                    mt-4
                                    text-sm
                                    leading-relaxed
                                    text-slate-500
                                "
                >
                  Completa todos los requisitos indicados en el panel lateral para habilitar el
                  cierre.
                </p>
              )}

              <button
                type="button"
                onClick={handleClose}
                disabled={saving || !canClose || requirements.closed}
                className="
                                    mt-5
                                    w-full
                                    rounded-xl
                                    bg-[#064E3B]
                                    px-5
                                    py-4
                                    text-base
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-[#033D2E]
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-300
                                "
              >
                {requirements.closed
                  ? "Trabajo de campo cerrado"
                  : "Cerrar y continuar al resultado técnico"}
              </button>
            </section>
          </div>

          {/* Panel lateral */}
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
                Requisitos para cerrar
              </h2>

              <p
                className="
                                mt-1
                                text-sm
                                leading-relaxed
                                text-slate-500
                            "
              >
                Completa estos elementos antes de finalizar.
              </p>

              <div
                className="
                                mt-5
                                space-y-4
                            "
              >
                <RequirementItem complete={requirements.started} label="Trazabilidad iniciada" />

                <RequirementItem complete={requirements.arrival} label="Llegada registrada" />

                <RequirementItem complete={requirements.notes} label="Notas guardadas" />

                <RequirementItem
                  complete={requirements.beforePhoto}
                  label="Al menos una foto antes"
                />

                <RequirementItem
                  complete={requirements.afterPhoto}
                  label="Al menos una foto después"
                />
              </div>
            </section>

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
                                border-b
                                border-slate-200
                                px-5
                                py-4
                            "
              >
                <h2
                  className="
                                    font-bold
                                    text-slate-900
                                "
                >
                  Evidencia ciudadana
                </h2>
              </div>

              {initialEvidence ? (
                <a
                  href={initialEvidence}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                                        group
                                        block
                                    "
                >
                  <img
                    src={initialEvidence}
                    alt={report.problemType}
                    className="
                                            h-52
                                            w-full
                                            object-cover
                                            transition
                                            duration-300
                                            group-hover:scale-[1.02]
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
                                            text-slate-500
                                        "
                    >
                      Imagen inicial
                    </span>

                    <span
                      className="
                                            text-sm
                                            font-semibold
                                            text-emerald-700
                                        "
                    >
                      Ampliar ↗
                    </span>
                  </div>
                </a>
              ) : (
                <div
                  className="
                                    flex
                                    min-h-52
                                    flex-col
                                    items-center
                                    justify-center
                                    px-5
                                    text-center
                                    text-slate-400
                                "
                >
                  <CameraIcon />

                  <p
                    className="
                                        mt-3
                                        text-sm
                                    "
                  >
                    No hay evidencia ciudadana disponible.
                  </p>
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
                                font-bold
                                text-slate-900
                            "
              >
                Resumen del reporte
              </h2>

              <p
                className="
                                mt-3
                                text-sm
                                leading-7
                                text-slate-600
                            "
              >
                {report.description}
              </p>

              {report.address && (
                <div
                  className="
                                    mt-4
                                    rounded-2xl
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
                    Dirección
                  </p>

                  <p
                    className="
                                        mt-2
                                        text-sm
                                        leading-relaxed
                                        text-slate-700
                                    "
                  >
                    {report.address}
                  </p>
                </div>
              )}

              {report.latitude !== undefined && report.longitude !== undefined && (
                <a
                  href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                                        mt-4
                                        inline-flex
                                        w-full
                                        items-center
                                        justify-center
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
                                        hover:bg-emerald-100
                                    "
                >
                  Abrir en Google Maps ↗
                </a>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function EvidenceUploader({
  number,
  title,
  description,
  phase,
  evidences,
  disabled,
  complete,
  onUpload,
  onDelete,
}: {
  number: number;
  title: string;
  description: string;
  phase: EvidencePhase;
  evidences: {
    id: string;
    imageUrl: string;
  }[];
  disabled: boolean;
  complete: boolean;

  onUpload: (event: ChangeEvent<HTMLInputElement>, phase: EvidencePhase) => void;

  onDelete: (evidenceId: string) => void;
}) {
  const inputId = `evidence-${phase}`;

  return (
    <section
      className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
        "
    >
      <div
        className="
                flex
                items-start
                gap-4
            "
      >
        <StepNumber number={number} complete={complete} />

        <div>
          <h2
            className="
                        text-xl
                        font-bold
                        text-slate-900
                    "
          >
            {title}
          </h2>

          <p
            className="
                        mt-1
                        text-sm
                        leading-relaxed
                        text-slate-500
                    "
          >
            {description}
          </p>
        </div>
      </div>

      <label
        htmlFor={inputId}
        className={`
                    mt-6
                    flex
                    min-h-32
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border-2
                    border-dashed
                    px-5
                    text-center
                    transition
                    ${
                      disabled
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
                        : "border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50"
                    }
                `}
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
                    opacity-70
                "
        >
          JPG, PNG o fotografía tomada desde el dispositivo
        </p>
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        capture="environment"
        disabled={disabled}
        onChange={(event) => onUpload(event, phase)}
        className="sr-only"
      />

      {evidences.length > 0 ? (
        <div
          className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-3
                "
        >
          {evidences.map((evidence) => (
            <div
              key={evidence.id}
              className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-100
                                "
            >
              <a href={evidence.imageUrl} target="_blank" rel="noopener noreferrer">
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

              <button
                type="button"
                onClick={() => onDelete(evidence.id)}
                disabled={disabled}
                className="
                                        absolute
                                        right-2
                                        top-2
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-600
                                        font-bold
                                        text-white
                                        shadow
                                        transition
                                        hover:bg-red-700
                                        disabled:opacity-50
                                    "
                title="Eliminar fotografía"
                aria-label="Eliminar fotografía"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
                    mt-4
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-center
                    text-xs
                    text-slate-400
                "
        >
          No se han registrado fotografías en esta etapa.
        </div>
      )}
    </section>
  );
}
