import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { statusLabels } from "../utils/reportLabels";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Report = {
    id: string;
    category: string;
    problemType: string;
    description: string;
    status: string;
    address?: string;
    createdAt: string;
    evidences: { imageUrl: string }[];
};

type CampoConfig = {
    label: string;
    placeholder: string;
    descripcion: string;
    minLength?: number;
};

const catalogoCategoria: Record<string, {
    checklist: string[];
    camposObligatorios: CampoConfig[];
    acciones: string[];
}> = {
    SECURITY: {
        checklist: [
            "Verificar zona de incidencia",
            "Documentar frecuencia del problema",
            "Notificar a unidad de seguridad",
        ],
        camposObligatorios: [
            {
                label: "Zona de riesgo",
                placeholder: "Ej: Esquina de Av. Arequipa con Jr. Moquegua",
                descripcion: "Indica la calle, cruce o área donde se concentra el problema",
                minLength: 10,
            },
            {
                label: "Frecuencia reportada",
                placeholder: "Ej: Todos los días entre 9pm y 12am",
                descripcion: "Horario o días en que suele ocurrir el incidente",
                minLength: 10,
            },
        ],
        acciones: [
            "Reparación — Coordinar con serenazgo",
            "Mitigación — Instalar cámara de vigilancia",
            "Derivación — Derivar a PNP",
        ],
    },
    ENVIRONMENT: {
        checklist: [
            "Verificar volumen acumulado",
            "Identificar punto crítico",
            "Tomar evidencia fotográfica",
        ],
        camposObligatorios: [
            {
                label: "Volumen estimado",
                placeholder: "Ej: 3 metros cúbicos aproximadamente",
                descripcion: "Estimación del tamaño o cantidad de residuos o contaminación",
                minLength: 5,
            },
            {
                label: "Punto exacto",
                placeholder: "Ej: Vereda frente al número 245 de Av. Lima",
                descripcion: "Ubicación precisa dentro de la dirección reportada",
                minLength: 10,
            },
        ],
        acciones: [
            "Reparación — Programar recojo o limpieza",
            "Mitigación — Limpieza inmediata parcial",
            "Derivación — Área de limpieza municipal",
        ],
    },
    INFRASTRUCTURE: {
        checklist: [
            "Evaluar extensión del daño",
            "Verificar riesgo para peatones o vehículos",
            "Medir área afectada",
        ],
        camposObligatorios: [
            {
                label: "Extensión del daño",
                placeholder: "Ej: 15 metros lineales de pista dañada",
                descripcion: "Longitud o área aproximada del tramo o elemento afectado",
                minLength: 5,
            },
            {
                label: "Nivel de riesgo",
                placeholder: "Ej: Alto — huecos de más de 20cm / poste caído",
                descripcion: "Describe si representa un peligro inmediato para la ciudadanía",
                minLength: 5,
            },
        ],
        acciones: [
            "Reparación — Intervención directa en sitio",
            "Mitigación — Señalización o cierre temporal",
            "Derivación — Derivar a área de infraestructura",
        ],
    },
    MOBILITY: {
        checklist: [
            "Verificar estado del tráfico en la zona",
            "Identificar causa del problema de movilidad",
            "Coordinar con serenazgo si es necesario",
        ],
        camposObligatorios: [
            {
                label: "Causa identificada",
                placeholder: "Ej: Vehículo abandonado bloquea carril derecho",
                descripcion: "Describe qué está causando el problema de movilidad",
                minLength: 10,
            },
            {
                label: "Impacto en el tráfico",
                placeholder: "Ej: Congestión en 2 cuadras, demora estimada 20 min",
                descripcion: "Indica el nivel de afectación al flujo vehicular o peatonal",
                minLength: 10,
            },
        ],
        acciones: [
            "Reparación — Retirar obstáculo o vehículo",
            "Mitigación — Desvío temporal de tráfico",
            "Derivación — Derivar a policía de tránsito",
        ],
    },
};

const catalogoDefault = {
    checklist: [
        "Verificar incidencia en sitio",
        "Documentar hallazgos",
        "Tomar fotografías",
    ],
    camposObligatorios: [
        {
            label: "Observaciones",
            placeholder: "Ej: Se encontró el problema tal como fue reportado por el ciudadano",
            descripcion: "Describe lo que encontraste al llegar al lugar",
            minLength: 10,
        },
    ],
    acciones: [
        "Reparación — Evaluar situación",
        "Mitigación — Tomar medidas correctivas",
        "Derivación — Derivar si es necesario",
    ],
};

const resultadosTecnicos = [
    { valor: "Aparentemente resuelto",        etiqueta: "Aparentemente resuelto" },
    { valor: "Parcialmente atendido",         etiqueta: "Parcialmente atendido" },
    { valor: "Requiere intervención adicional", etiqueta: "Requiere intervención adicional" },
    { valor: "Caso derivado",                 etiqueta: "Caso derivado" },
];

const pasosSidebar = ["Verificación en sitio", "Datos requeridos", "Acción realizada", "Resultado técnico"];

export default function TechnicianAttendPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState(false);
    const [errores, setErrores] = useState<Record<string, string>>({});

    const [checklistCompletado, setChecklistCompletado] = useState<Record<string, boolean>>({});
    const [campos, setCampos] = useState<Record<string, string>>({});
    const [accionSeleccionada, setAccionSeleccionada] = useState("");
    const [resultadoSeleccionado, setResultadoSeleccionado] = useState("");

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

    const catalogo = report
        ? (catalogoCategoria[report.category] ?? catalogoDefault)
        : catalogoDefault;

    useEffect(() => {
        if (!report) return;
        const c = catalogoCategoria[report.category] ?? catalogoDefault;
        const storageKey = `technician-attend-${id}`;
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            const parsed = JSON.parse(saved);
            setChecklistCompletado(parsed.checklistCompletado ?? c.checklist.reduce((acc, item) => ({ ...acc, [item]: false }), {}));
            setCampos(parsed.campos ?? c.camposObligatorios.reduce((acc, campo) => ({ ...acc, [campo.label]: "" }), {}));
            setAccionSeleccionada(parsed.accionSeleccionada ?? "");
            setResultadoSeleccionado(parsed.resultadoSeleccionado ?? "");
        } else {
            setChecklistCompletado(c.checklist.reduce((acc, item) => ({ ...acc, [item]: false }), {}));
            setCampos(c.camposObligatorios.reduce((acc, campo) => ({ ...acc, [campo.label]: "" }), {}));
        }
    }, [report?.category]);

    useEffect(() => {
        if (!id || !report) return;
        localStorage.setItem(`technician-attend-${id}`, JSON.stringify({
            checklistCompletado,
            campos,
            accionSeleccionada,
            resultadoSeleccionado,
        }));
    }, [checklistCompletado, campos, accionSeleccionada, resultadoSeleccionado]);

    const toggleChecklist = (item: string) => {
        setChecklistCompletado((prev) => ({ ...prev, [item]: !prev[item] }));
    };

    const validar = (): Record<string, string> => {
        const nuevosErrores: Record<string, string> = {};

        catalogo.camposObligatorios.forEach((campo) => {
            const valor = campos[campo.label] ?? "";
            if (valor.trim() === "") {
                nuevosErrores[campo.label] = `Este campo es obligatorio`;
            } else if (campo.minLength && valor.trim().length < campo.minLength) {
                nuevosErrores[campo.label] = `Debe tener al menos ${campo.minLength} caracteres`;
            }
        });

        if (!accionSeleccionada) {
            nuevosErrores["accion"] = "Debes seleccionar una acción realizada";
        }

        if (!resultadoSeleccionado) {
            nuevosErrores["resultado"] = "Debes seleccionar un resultado técnico";
        }

        return nuevosErrores;
    };

    const ejecutarGuardado = async () => {
        if (!report) return;
        await fetch(`${API_URL}/api/reports/${report.id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "IN_PROGRESS" }),
        });
        localStorage.removeItem(`technician-attend-${id}`);
    };

    const guardarYSalir = async () => {
        if (!report) return;
        const nuevosErrores = validar();
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }
        setErrores({});
        setSaving(true);
        try {
            await ejecutarGuardado();
            navigate("/technician");
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const guardarYContinuar = async () => {
        if (!report) return;
        const nuevosErrores = validar();
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }
        setErrores({});
        setSaving(true);
        try {
            await ejecutarGuardado();
            setSavedMessage(true);
            setTimeout(() => {
                setSavedMessage(false);
                navigate(`/technician/report/${id}/evidence`);
            }, 1500);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-3xl font-bold">Cargando...</div>;
    if (!report) return <div className="min-h-screen flex items-center justify-center text-3xl font-bold">Reporte no encontrado</div>;

    return (
        <div className="min-h-screen bg-[#F5F7FA] flex">

            {/* Sidebar */}
            <aside className="w-[260px] min-h-screen bg-[#03152E] text-white p-6 flex flex-col justify-between sticky top-0">
                <div>
                    <h1 className="text-4xl font-bold mb-10">
                        reporta<span className="text-yellow-400">Ya</span>
                    </h1>

                    <p className="text-white/50 text-xs uppercase tracking-wide mb-3">Trabajo actual</p>
                    <div className="bg-white/10 rounded-2xl p-4 space-y-2 mb-8">
                        <p className="font-semibold text-lg">{report.problemType}</p>
                        <p className="text-white/60 text-sm">{report.address || "Ubicación no disponible"}</p>
                        <span className="inline-block bg-blue-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                            {statusLabels[report.status]}
                        </span>
                    </div>

                    <p className="text-white/50 text-xs uppercase tracking-wide mb-4">Progreso de atención</p>
                    <div className="space-y-4">
                        {pasosSidebar.map((paso, i) => (
                            <div key={paso} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                                <span className="text-white/70 text-sm">{paso}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-white/50 text-xs leading-relaxed">
                            Este registro es preliminar. El operador revisará y formalizará el cierre en los siguientes pasos del flujo.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 p-10 overflow-y-auto">

                <button onClick={() => navigate("/technician")} className="text-blue-600 font-semibold mb-8 hover:underline block">
                    ← Volver a mis trabajos
                </button>

                <h2 className="text-5xl font-bold mb-2">Atencion reportes</h2>
                <p className="text-gray-500 text-xl mb-10">Documenta lo que encontraste y realizaste en el lugar. Este registro es preliminar.</p>

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

                    {/* PASO 1 — Checklist dinámico por categoría */}
                    <div className="bg-white rounded-3xl border shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#03152E] text-white flex items-center justify-center font-bold text-sm">1</div>
                            <h3 className="text-2xl font-bold">Verificación en sitio</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Marca lo que pudiste verificar en sitio para esta categoría: {report.problemType}</p>
                        <div className="space-y-3">
                            {catalogo.checklist.map((item) => (
                                <button key={item} type="button" onClick={() => toggleChecklist(item)} className="flex items-center gap-3 cursor-pointer w-full text-left group">
                                    <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition flex-shrink-0 ${checklistCompletado[item] ? "bg-[#03152E] border-[#03152E]" : "border-gray-300 group-hover:border-gray-400"}`}>
                                        {checklistCompletado[item] && <span className="text-white text-xs font-bold">✓</span>}
                                    </span>
                                    <span className={checklistCompletado[item] ? "line-through text-gray-400" : "text-gray-700"}>{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PASO 2 — Campos obligatorios condicionales por categoría */}
                    <div className="bg-white rounded-3xl border shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#03152E] text-white flex items-center justify-center font-bold text-sm">2</div>
                            <h3 className="text-2xl font-bold">Datos requeridos</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Datos que encontraste en campo para esta categoría de problema</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {catalogo.camposObligatorios.map((campo) => (
                                <div key={campo.label}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label} *</label>
                                    <p className="text-xs text-gray-400 mb-2">{campo.descripcion}</p>
                                    <input
                                        type="text"
                                        value={campos[campo.label] || ""}
                                        onChange={(e) => {
                                            setCampos((prev) => ({ ...prev, [campo.label]: e.target.value }));
                                            if (errores[campo.label]) setErrores((prev) => { const err = { ...prev }; delete err[campo.label]; return err; });
                                        }}
                                        placeholder={campo.placeholder}
                                        className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 text-gray-700 ${errores[campo.label] ? "border-red-400 focus:ring-red-300" : "focus:ring-[#03152E]"}`}
                                    />
                                    {errores[campo.label] && (
                                        <p className="text-red-500 text-xs mt-1">{errores[campo.label]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PASO 3 — Acción específica por categoría */}
                    <div className="bg-white rounded-3xl border shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#03152E] text-white flex items-center justify-center font-bold text-sm">3</div>
                            <h3 className="text-2xl font-bold">Acción técnica realizada</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">¿Qué intervención hiciste físicamente en el lugar?</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {catalogo.acciones.map((accion) => (
                                <button
                                    key={accion}
                                    type="button"
                                    onClick={() => {
                                        setAccionSeleccionada(accion);
                                        if (errores["accion"]) setErrores((prev) => { const err = { ...prev }; delete err["accion"]; return err; });
                                    }}
                                    className={`p-4 rounded-2xl border-2 text-left text-sm font-medium transition ${accionSeleccionada === accion ? "border-[#03152E] bg-[#03152E] text-white" : errores["accion"] ? "border-red-300 text-gray-700" : "border-gray-200 hover:border-gray-400 text-gray-700"}`}
                                >
                                    {accion}
                                </button>
                            ))}
                        </div>
                        {errores["accion"] && <p className="text-red-500 text-xs mt-3">{errores["accion"]}</p>}
                    </div>

                    {/* PASO 4 — Resultado técnico (cierre formal = US19) */}
                    <div className="bg-white rounded-3xl border shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#03152E] text-white flex items-center justify-center font-bold text-sm">4</div>
                            <h3 className="text-2xl font-bold">Evaluación preliminar del resultado</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">¿Cómo percibes que quedó el caso? Sujeto a validación en el cierre formal.</p>
                        <div className="space-y-2">
                            {resultadosTecnicos.map((resultado) => (
                                <button
                                    key={resultado.valor}
                                    type="button"
                                    onClick={() => {
                                        setResultadoSeleccionado(resultado.valor);
                                        if (errores["resultado"]) setErrores((prev) => { const err = { ...prev }; delete err["resultado"]; return err; });
                                    }}
                                    className={`flex items-center gap-3 cursor-pointer w-full text-left p-3 rounded-xl transition ${resultadoSeleccionado === resultado.valor ? "bg-[#03152E]/5" : "hover:bg-gray-50"}`}
                                >
                                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${resultadoSeleccionado === resultado.valor ? "border-[#03152E] bg-[#03152E]" : errores["resultado"] ? "border-red-300" : "border-gray-300"}`}>
                                        {resultadoSeleccionado === resultado.valor && <span className="w-2.5 h-2.5 rounded-full bg-white block" />}
                                    </span>
                                    <span className={resultadoSeleccionado === resultado.valor ? "text-[#03152E] font-semibold" : "text-gray-700"}>
                                        {resultado.etiqueta}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {errores["resultado"] && <p className="text-red-500 text-xs mt-3">{errores["resultado"]}</p>}
                    </div>

                    {/* Botones finales */}
                    <div className="pb-10 space-y-3">

                        {savedMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-6 py-4 text-center font-medium">
                                ✓ Atención guardada correctamente
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={guardarYSalir}
                                disabled={saving}
                                className="flex-1 rounded-2xl p-5 text-lg font-semibold transition border-2 border-[#03152E] text-[#03152E] hover:bg-[#03152E] hover:text-white disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {saving ? "Guardando..." : "Guardar y salir"}
                            </button>

                            <button
                                onClick={guardarYContinuar}
                                disabled={saving}
                                className="flex-1 rounded-2xl p-5 text-lg font-semibold transition bg-[#03152E] hover:bg-[#052444] text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {saving ? "Guardando..." : "Guardar y continuar →"}
                            </button>
                        </div>

                        <p className="text-center text-gray-400 text-sm">Este registro es preliminar y será revisado en los siguientes pasos del flujo operativo.</p>
                    </div>

                </div>
            </main>
        </div>
    );
}
