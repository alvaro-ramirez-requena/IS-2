import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";


// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FieldWorkEvidence {
  id: string;
  imageUrl: string;
  phase: "BEFORE" | "AFTER";
}

interface FieldWorkState {
  id: string;
  reportId: string;
  arrivedAt: string | null;
  closedAt: string | null;
  distanceMeters: number | null;
  notes: string;
  evidences: FieldWorkEvidence[];
  durationMinutes: number | null;
}

// Acciones pendientes cuando no hay conexión
interface PendingAction {
  type: "notes" | "arrive" | "close";
  reportId: string;
  payload?: any;
  timestamp: number;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TECHNICIAN_ID = localStorage.getItem("userId") || "";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function savePendingAction(action: PendingAction) {
  const existing: PendingAction[] = JSON.parse(
    localStorage.getItem("pendingFieldWork") || "[]"
  );
  existing.push(action);
  localStorage.setItem("pendingFieldWork", JSON.stringify(existing));
}

async function syncPendingActions() {
  const pending: PendingAction[] = JSON.parse(
    localStorage.getItem("pendingFieldWork") || "[]"
  );
  if (pending.length === 0) return;

  const remaining: PendingAction[] = [];

  for (const action of pending) {
    try {
      if (action.type === "arrive") {
        await fetch(`${API}/api/fieldwork/${action.reportId}/arrive`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.payload),
        });
      } else if (action.type === "notes") {
        await fetch(`${API}/api/fieldwork/${action.reportId}/notes`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.payload),
        });
      } else if (action.type === "close") {
        await fetch(`${API}/api/fieldwork/${action.reportId}/close`, {
          method: "PATCH",
        });
      }
    } catch {
      remaining.push(action); // Si falla, lo vuelve a guardar
    }
  }

  localStorage.setItem("pendingFieldWork", JSON.stringify(remaining));
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function FieldWorkPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();

  const [fieldWork, setFieldWork] = useState<FieldWorkState | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [uploadingPhase, setUploadingPhase] = useState<"BEFORE" | "AFTER" | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);


  const lastSavedNotes = useRef("");

  // ── Detectar conexión ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setMessage({ text: "Conexión recuperada. Sincronizando datos...", type: "success" });
      await syncPendingActions();
      await loadFieldWork();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setMessage({ text: "Sin conexión. Los cambios se guardarán localmente.", type: "warning" });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ── Cargar datos del trabajo de campo ───────────────────────────────────────
  async function loadFieldWork() {
    try {
      const res = await fetch(`${API}/api/fieldwork/${reportId}`);
      if (res.ok) {
        const data = await res.json();
        setFieldWork(data);
        setNotes(data.notes || "");
        lastSavedNotes.current = data.notes || "";
      } else {
        // Si no existe aún, lo crea
        await startFieldWork();
      }
    } catch {
      setMessage({ text: "Error al cargar el trabajo de campo", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFieldWork();
  }, [reportId]);


  // ── Iniciar trabajo de campo ─────────────────────────────────────────────────
  async function startFieldWork() {
    try {
      const res = await fetch(`${API}/api/fieldwork/${reportId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicianId: TECHNICIAN_ID }),
      });
      if (res.ok) {
  await loadFieldWork();
}
    } catch {
      setMessage({ text: "Error al iniciar el trabajo de campo", type: "error" });
    }
  }

  // ── Registrar llegada ────────────────────────────────────────────────────────
  async function registerArrival() {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const payload = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        if (!isOnline) {
          savePendingAction({ type: "arrive", reportId: reportId!, payload, timestamp: Date.now() });
          setMessage({ text: "Llegada guardada localmente. Se sincronizará al recuperar conexión.", type: "warning" });
          setFieldWork((prev) => prev ? { ...prev, arrivedAt: new Date().toISOString() } : prev);
          return;
        }

        try {
          const res = await fetch(`${API}/api/fieldwork/${reportId}/arrive`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          await loadFieldWork();

          if (data.locationWarning) {
            setMessage({ text: data.locationWarning, type: "warning" });
          } else if (data.distanceMeters !== null) {
            setMessage({ text: `✅ Llegada registrada. Estás a ${Math.round(data.distanceMeters)} metros del punto reportado.`, type: "success" });
          } else {
            setMessage({ text: "✅ Llegada registrada correctamente.", type: "success" });
          }
        } catch {
          setMessage({ text: "Error al registrar la llegada", type: "error" });
        }
      },
      () => {
        // Si el técnico no comparte ubicación, registra igual sin coordenadas
        registerArrivalWithoutGPS();
      }
    );
  }

  async function registerArrivalWithoutGPS() {
    if (!isOnline) {
      savePendingAction({ type: "arrive", reportId: reportId!, payload: {}, timestamp: Date.now() });
      setFieldWork((prev) => prev ? { ...prev, arrivedAt: new Date().toISOString() } : prev);
      setMessage({ text: "Llegada guardada sin GPS. Se sincronizará al recuperar conexión.", type: "warning" });
      return;
    }
    try {
      const res = await fetch(`${API}/api/fieldwork/${reportId}/arrive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setFieldWork((prev) => prev ? { ...prev, ...data } : prev);
      setMessage({ text: "✅ Llegada registrada (sin validación de ubicación).", type: "success" });
    } catch {
      setMessage({ text: "Error al registrar la llegada", type: "error" });
    }
  }

  // ── Guardar notas ────────────────────────────────────────────────────────────
  async function saveNotes(text: string, silent = false) {
    if (!isOnline) {
      savePendingAction({ type: "notes", reportId: reportId!, payload: { notes: text }, timestamp: Date.now() });
      lastSavedNotes.current = text;
      if (!silent) setMessage({ text: "Nota guardada localmente.", type: "warning" });
      return;
    }
    try {
      await fetch(`${API}/api/fieldwork/${reportId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: text }),
      });
      lastSavedNotes.current = text;
      if (!silent) setMessage({ text: "✅ Notas guardadas.", type: "success" });
    } catch {
      if (!silent) setMessage({ text: "Error al guardar las notas", type: "error" });
    }
  }

  // ── Cerrar trabajo ───────────────────────────────────────────────────────────
  async function registerClosure() {
    if (!isOnline) {
      savePendingAction({ type: "close", reportId: reportId!, timestamp: Date.now() });
      setFieldWork((prev) => prev ? { ...prev, closedAt: new Date().toISOString() } : prev);
      setMessage({ text: "Cierre guardado localmente. Se sincronizará al recuperar conexión.", type: "warning" });
      return;
    }
    try {
      await fetch(`${API}/api/fieldwork/${reportId}/close`, { method: "PATCH" });
await loadFieldWork();
      setMessage({ text: "✅ Trabajo cerrado correctamente.", type: "success" });
    } catch {
      setMessage({ text: "Error al cerrar el trabajo", type: "error" });
    }
  }

  // ── Subir evidencia ──────────────────────────────────────────────────────────
  async function uploadEvidence(file: File, phase: "BEFORE" | "AFTER") {
    setUploadingPhase(phase);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("phase", phase);

    try {
      const res = await fetch(`${API}/api/fieldwork/${reportId}/evidence`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const newEvidence = await res.json();
      setFieldWork((prev) =>
        prev ? { ...prev, evidences: [...prev.evidences, newEvidence] } : prev
      );
      setMessage({ text: `✅ Foto ${phase === "BEFORE" ? "anterior" : "posterior"} subida correctamente.`, type: "success" });
    } catch {
      setMessage({ text: "Error al subir la imagen", type: "error" });
    } finally {
      setUploadingPhase(null);
    }
  }

  // ── Eliminar evidencia ───────────────────────────────────────────────────────
  async function removeEvidence(evidenceId: string) {
    try {
      await fetch(`${API}/api/fieldwork/evidence/${evidenceId}`, {
        method: "DELETE",
      });
      setFieldWork((prev) =>
        prev
          ? { ...prev, evidences: prev.evidences.filter((e) => e.id !== evidenceId) }
          : prev
      );
    } catch {
      setMessage({ text: "Error al eliminar la imagen", type: "error" });
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Cargando trabajo de campo...</p>
      </div>
    );
  }

  const beforePhotos = fieldWork?.evidences.filter((e) => e.phase === "BEFORE") || [];
  const afterPhotos = fieldWork?.evidences.filter((e) => e.phase === "AFTER") || [];

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">

      {/* ── Indicador de conexión ── */}
      <div className={`flex items-center gap-2 text-sm mb-4 px-3 py-2 rounded-lg ${isOnline ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
        <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-yellow-500"}`} />
        {isOnline ? "Conectado" : "Sin conexión — guardando datos localmente"}
      </div>

      {/* ── Mensaje ── */}
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          message.type === "success" ? "bg-green-50 text-green-700" :
          message.type === "warning" ? "bg-yellow-50 text-yellow-700" :
          "bg-red-50 text-red-700"
        }`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right font-bold">×</button>
        </div>
      )}

      <button
  onClick={() => navigate("/my-reports")}
  className="mb-4 text-blue-700 font-semibold hover:underline"
>
  ← Volver a Mis reportes
</button>
<h1 className="text-2xl font-bold text-gray-800 mb-6">Trabajo en campo</h1>

      {/* ── Resumen de tiempos ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
        <h2 className="font-semibold text-gray-700 mb-3">Tiempos de atención</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Llegada</p>
            <p className="text-lg font-semibold text-gray-800">{formatTime(fieldWork?.arrivedAt || null)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Cierre</p>
            <p className="text-lg font-semibold text-gray-800">{formatTime(fieldWork?.closedAt || null)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Duración</p>
            <p className="text-lg font-semibold text-gray-800">
              {fieldWork?.durationMinutes != null
              ? fieldWork.durationMinutes < 60
              ? `${fieldWork.durationMinutes} min`
              : `${Math.floor(fieldWork.durationMinutes / 60)} h ${fieldWork.durationMinutes % 60} min`
              : "—"}
            </p>
          </div>
        </div>


      

        {/* Distancia al punto */}
        {fieldWork?.distanceMeters != null && (
          <p className={`text-sm mt-3 text-center ${fieldWork.distanceMeters > 200 ? "text-yellow-600" : "text-green-600"}`}>
            {fieldWork.distanceMeters > 200
              ? `⚠️ ${Math.round(fieldWork.distanceMeters)} m del punto reportado`
              : `✅ ${Math.round(fieldWork.distanceMeters)} m del punto reportado`}
          </p>
        )}

        {/* Botones de llegada y cierre */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={registerArrival}
            disabled={!!fieldWork?.arrivedAt}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              fieldWork?.arrivedAt
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {fieldWork?.arrivedAt ? "✅ Llegada registrada" : "Registrar llegada"}
          </button>
          <button
            onClick={registerClosure}
            disabled={!fieldWork?.arrivedAt || !!fieldWork?.closedAt}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              !fieldWork?.arrivedAt || fieldWork?.closedAt
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {fieldWork?.closedAt ? "✅ Trabajo cerrado" : "Cerrar trabajo"}
          </button>
        </div>
      </div>

{/* ── Notas de trabajo ── */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
  <h2 className="font-semibold text-gray-700 mb-3">Notas de trabajo</h2>
  <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder="Describe las acciones realizadas, observaciones y estado del problema..."
    rows={5}
    disabled={!isEditingNotes && !!lastSavedNotes.current}
    className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      !isEditingNotes && lastSavedNotes.current
        ? "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
        : "border-gray-200"
    }`}
  />
  <div className="flex justify-end gap-2 mt-2">
    {!isEditingNotes && lastSavedNotes.current ? (
      <button
        onClick={() => setIsEditingNotes(true)}
        className="px-4 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
      >
        Editar
      </button>
    ) : (
      <button
        onClick={() => {
          saveNotes(notes);
          setIsEditingNotes(false);
        }}
        className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
      >
        Guardar notas
      </button>
    )}
  </div>
</div>

      {/* ── Fotos antes ── */}
      <EvidenceSection
        title="Fotos antes de la intervención"
        phase="BEFORE"
        photos={beforePhotos}
        uploading={uploadingPhase === "BEFORE"}
        onUpload={uploadEvidence}
        onRemove={removeEvidence}
        disabled={!!fieldWork?.closedAt}
      />

      {/* ── Fotos después ── */}
      <EvidenceSection
        title="Fotos después de la intervención"
        phase="AFTER"
        photos={afterPhotos}
        uploading={uploadingPhase === "AFTER"}
        onUpload={uploadEvidence}
        onRemove={removeEvidence}
        disabled={!!fieldWork?.closedAt}
      />

    </div>
  );
}

// ─── Sub-componente de evidencias ─────────────────────────────────────────────

function EvidenceSection({
  title,
  phase,
  photos,
  uploading,
  onUpload,
  onRemove,
  disabled,
}: {
  title: string;
  phase: "BEFORE" | "AFTER";
  photos: FieldWorkEvidence[];
  uploading: boolean;
  onUpload: (file: File, phase: "BEFORE" | "AFTER") => void;
  onRemove: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
      <h2 className="font-semibold text-gray-700 mb-3">{title}</h2>

      {/* Grid de fotos */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.imageUrl}
              alt={`evidencia ${phase}`}
              className="w-full h-24 object-cover rounded-lg"
            />
            {!disabled && (
              <button
                onClick={() => onRemove(photo.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Botón de carga */}
      {!disabled && (
        <label className={`flex items-center justify-center gap-2 w-full py-2 border-2 border-dashed rounded-lg text-sm cursor-pointer transition-colors ${
          uploading
            ? "border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-blue-300 text-blue-600 hover:bg-blue-50"
        }`}>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file, phase);
              e.target.value = "";
            }}
          />
          {uploading ? "Subiendo..." : `+ Agregar foto`}
        </label>
      )}

      {photos.length === 0 && !uploading && (
        <p className="text-xs text-gray-400 text-center mt-2">Sin fotos aún</p>
      )}
    </div>
  );
}
