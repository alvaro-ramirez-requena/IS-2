import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import {
    statusLabels,
} from "../utils/reportLabels";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

type Report = {
    id: string;
    problemType: string;
    description: string;
    status: string;
    address?: string;
    createdAt: string;
    evidences: {
        imageUrl: string;
    }[];
};

// Catálogo de tipos de atención por tipo de problema.
// En el futuro debería venir del backend (US21 - Configurar catálogo operativo),
// por ahora está hardcodeado como CategorySection.
const catalogoAtencion: Record<
    string,
    {
        checklist: string[];
        camposObligatorios: string[];
        acciones: string[];
    }
> = {
    "Robos y asaltos": {
        checklist: [
            "Verificar zona de incidencia",
            "Documentar frecuencia del problema",
            "Notificar a unidad de seguridad",
        ],
        camposObligatorios: ["Zona de riesgo", "Frecuencia reportada"],
        acciones: [
            "Reparación — Coordinar con serenazgo",
            "Mitigación — Instalar cámara de vigilancia",
            "Derivación — Derivar a PNP",
        ],
    },
    "Acumulación de basura": {
        checklist: [
            "Verificar volumen acumulado",
            "Identificar punto crítico",
            "Tomar evidencia fotográfica",
        ],
        camposObligatorios: ["Volumen estimado", "Punto exacto"],
        acciones: [
            "Reparación — Programar recojo",
            "Mitigación — Limpieza inmediata",
            "Derivación — Área de limpieza",
        ],
    },
    "Pistas en mal estado": {
        checklist: [
            "Evaluar extensión del daño",
            "Verificar riesgo vial",
            "Medir área afectada",
        ],
        camposObligatorios: ["Metros afectados", "Nivel de riesgo"],
        acciones: [
            "Reparación — Reparación en sitio",
            "Mitigación — Señalización temporal",
            "Derivación — Derivar a infraestructura",
        ],
    },
    "Alumbrado público defectuoso": {
        checklist: [
            "Identificar cantidad de postes afectados",
            "Verificar tipo de falla",
            "Revisar zona de cobertura",
        ],
        camposObligatorios: ["Número de postes", "Tipo de falla"],
        acciones: [
            "Reparación — Reemplazo de luminaria",
            "Mitigación — Revisión de cableado",
            "Derivación — Derivar a empresa eléctrica",
        ],
    },
};

// Plantilla por defecto para tipos de problema sin catálogo específico aún
const catalogoDefault = {
    checklist: [
        "Verificar incidencia en sitio",
        "Documentar hallazgos",
        "Tomar fotografías",
    ],
    camposObligatorios: ["Observaciones"],
    acciones: [
        "Reparación — Evaluar situación",
        "Mitigación — Tomar medidas correctivas",
        "Derivación — Derivar si es necesario",
    ],
};

const resultadosTecnicos = [
    { valor: "Resuelto en sitio", etiqueta: "Resuelto en sitio" },
    { valor: "Mitigación temporal", etiqueta: "Mitigación temporal" },
    { valor: "Derivado a área responsable", etiqueta: "Derivado a área responsable" },
    { valor: "Requiere seguimiento", etiqueta: "Requiere seguimiento" },
];

export default function TechnicianAttendPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Trae el reporte real desde el backend usando el endpoint existente GET /:id
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`${API_URL}/api/reports/${id}`);
                const data = await response.json();
                setReport(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    // Catálogo según el tipo de problema del reporte; si no existe, usa el default
    const catalogo =
        (report && catalogoAtencion[report.problemType]) || catalogoDefault;

    const [checklistCompletado, setChecklistCompletado] = useState<Record<string, boolean>>({});
    const [campos, setCampos] = useState<Record<string, string>>({});
    const [observaciones, setObservaciones] = useState("");
    const [accionSeleccionada, setAccionSeleccionada] = useState("");
    const [resultadoSeleccionado, setResultadoSeleccionado] = useState("");

    // Inicializa el checklist y los campos cuando el reporte llega y se conoce el catálogo
    useEffect(() => {
        if (!report) return;

        const catalogoActual =
            catalogoAtencion[report.problemType] || catalogoDefault;

        setChecklistCompletado(
            catalogoActual.checklist.reduce((acc, item) => ({ ...acc, [item]: false }), {})
        );
        setCampos(
            catalogoActual.camposObligatorios.reduce((acc, campo) => ({ ...acc, [campo]: "" }), {})
        );
    }, [report?.problemType]);

    const toggleChecklist = (item: string) => {
        setChecklistCompletado((prev) => ({ ...prev, [item]: !prev[item] }));
    };

    const formularioCompleto =
        accionSeleccionada !== "" &&
        resultadoSeleccionado !== "" &&
        Object.values(campos).every((v) => v.trim() !== "");

    // Guarda la atención. Por ahora usa el endpoint existente PATCH /:id/status
    // para reflejar que el reporte sigue en proceso (no se cierra aquí, ver US19).
    const guardarAtencion = async () => {
        if (!report || !formularioCompleto) return;

        setSaving(true);

        try {
            await fetch(`${API_URL}/api/reports/${report.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "IN_PROGRESS" }),
            });

            // TODO: cuando exista un endpoint dedicado para la atención técnica
            // (checklist, campos, acción, resultado), reemplazar este PATCH genérico
            // por una llamada que guarde toda esta información en su propia tabla.

            navigate("/technician");

        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
                Cargando...
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
                Reporte no encontrado
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] flex">

            {/* Sidebar */}
            <aside className="w-[260px] min-h-screen bg-[#03152E] text-white p-6 flex flex-col justify-between sticky top-0">
                <div>
                    <h1 className="text-4xl font-bold mb-14">
                        reporta<span className="text-yellow-400">Ya</span>
                    </h1>

                    <p className="text-white/50 text-xs uppercase tracking-wide mb-3">Trabajo actual</p>
                    <div className="bg-white/10 rounded-2xl p-4 space-y-2 mb-10">
                        <p className="font-semibold text-lg">{report.problemType}</p>
                        <p className="text-white/60 text-sm">{report.address || "Ubicación no disponible"}</p>
                        <span className="inline-block bg-blue-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                            {statusLabels[report.status]}
                        </span>
                    </div>

                    <p className="text-white/50 text-xs uppercase tracking-wide mb-4">Progreso de atención</p>
                    <div className="space-y-4">
                        {["Verificación en sitio", "Datos requeridos", "Acción realizada", "Resultado técnico"].map((paso, i) => (
                            <div key={paso} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                </div>
                                <span className="text-white/70 text-sm">{paso}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-white/50 text-xs leading-relaxed">
                            El cierre definitivo del caso se confirma en el siguiente paso del flujo operativo.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 p-10 overflow-y-auto">

                <button
                    onClick={() => navigate("/technician")}
                    className="text-blue-600 font-semibold mb-8 hover:underline block"
                >
                    ← Volver a mis trabajos
                </button>

                <h2 className="text-5xl font-bold mb-2">Atender reporte</h2>
                <p className="text-gray-500 text-xl mb-10">
                    Registra el checklist, datos y acción según el tipo de problema
                </p>

                <div className="space-y-6">

                    {/* Detalle del reporte */}
                    <div className="bg-white rounded-3xl border shadow-sm p-8">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-3xl font-bold">{report.problemType}</h3>
                                <p className="text-gray-500 mt-1">{report.address || "Ubicación no disponible"}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold whitespace-nowrap">
                                {statusLabels[report.status]}
                            </span>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed">{report.description}</p>
                    </div>

                    {/* PASO 1 — Checklist dinámico */}
                    <div className="bg-white rounded-3xl border shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#03152E] text-white flex items-center justify-center font-bold text-sm">1</div>
                            <h3 className="text-2xl font-bold">Verificación en sitio</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            Checklist generado según el tipo de problema: {report.problemType}
                        </p>
                        <div className="space-y-3">
                            {catalogo.checklist.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => toggleChecklist(item)}
                                    className="flex items-center gap-3 cursor-pointer w-full text-left group"
                                >
                                    <span
                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition flex-shrink-0 ${
                                            checklistCompletado[item]
                                                ? "bg-[#03152E] border-[#03152E]"
                                                : "border-gray-300 group-hover:border-gray-400"
                                        }`}
                                    >
                                        {checklistCompletado[item] && (
                                            <span className="text-white text-xs font-bold">✓</span>
                                        )}
                                    </span>
                                    <span className={checklistCompletado[item] ? "line-through text-gray-400" : "text-gray-700"}>
                                        {item}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PASO 2 — Campos obligatorios condicionales */}
                    <div className="bg-white rounded-3xl border shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#03152E] text-white flex items-center justify-center font-bold text-sm">2</div>
                            <h3 className="text-2xl font-bold">Datos requeridos</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            Campos obligatorios para esta categoría de problema
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {catalogo.camposObligatorios.map((campo) => (
                                <div key={campo}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{campo} *</label>
                                    <input
                                        type="text"
                                        value={campos[campo] || ""}
                                        onChange={(e) =>
                                            setCampos((prev) => ({ ...prev, [campo]: e.target.value }))
                                        }
                                        placeholder={`Ingresa ${campo.toLowerCase()}`}
                                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#03152E] text-gray-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PASO 3 — Acción específica por problema */}
                    <div className="bg-white rounded-3xl border shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#03152E] text-white flex items-center justify-center font-bold text-sm">3</div>
                            <h3 className="text-2xl font-bold">Acción realizada</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            Selecciona si la atención fue reparación, mitigación o derivación
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {catalogo.acciones.map((accion) => (
                                <button
                                    key={accion}
                                    onClick={() => setAccionSeleccionada(accion)}
                                    className={`p-4 rounded-2xl border-2 text-left text-sm font-medium transition ${
                                        accionSeleccionada === accion
                                            ? "border-[#03152E] bg-[#03152E] text-white"
                                            : "border-gray-200 hover:border-gray-400 text-gray-700"
                                    }`}
                                >
                                    {accion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PASO 4 — Resultado técnico (preliminar; el cierre formal es US19) */}
                    <div className="bg-white rounded-3xl border shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#03152E] text-white flex items-center justify-center font-bold text-sm">4</div>
                            <h3 className="text-2xl font-bold">Resultado técnico</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            Esta disposición se usará en el cierre formal del caso
                        </p>
                        <div className="space-y-3">
                            {resultadosTecnicos.map((resultado) => (
                                <button
                                    key={resultado.valor}
                                    type="button"
                                    onClick={() => setResultadoSeleccionado(resultado.valor)}
                                    className={`flex items-center gap-3 cursor-pointer w-full text-left p-3 rounded-xl transition ${
                                        resultadoSeleccionado === resultado.valor
                                            ? "bg-[#03152E]/5"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <span
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${
                                            resultadoSeleccionado === resultado.valor
                                                ? "border-[#03152E] bg-[#03152E]"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {resultadoSeleccionado === resultado.valor && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                                        )}
                                    </span>
                                    <span
                                        className={
                                            resultadoSeleccionado === resultado.valor
                                                ? "text-[#03152E] font-semibold"
                                                : "text-gray-700"
                                        }
                                    >
                                        {resultado.etiqueta}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botón final — solo guarda, no cierra el caso (cierre = US19) */}
                    <div className="pb-10">
                        <button
                            onClick={guardarAtencion}
                            disabled={!formularioCompleto || saving}
                            className={`w-full rounded-2xl p-5 text-xl font-semibold transition ${
                                formularioCompleto && !saving
                                    ? "bg-[#03152E] hover:bg-[#052444] text-white"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {saving ? "Guardando..." : "Guardar atención"}
                        </button>
                        <p className="text-center text-gray-400 text-sm mt-3">
                            El cierre definitivo del caso se confirma en el siguiente paso
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}
