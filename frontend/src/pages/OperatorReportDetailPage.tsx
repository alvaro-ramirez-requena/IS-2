import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { statusLabels } from "../utils/reportLabels";
import AssignmentSection from "../components/assignment/AssignmentSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Report = {
    id: string;
    problemType: string;
    description: string;
    status: string;
    priority?: "ALTO" | "MEDIO" | "BAJO";
    operationalType?: string;
    targetDate?: string;
    justification?: string;
    createdAt: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    evidences: { imageUrl: string; }[];
    isAnonymous: boolean;
    user?: {
        firstName: string;
        lastName: string;
    };
    message?: string;
};

export default function OperatorReportDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [impact, setImpact] = useState("BAJO");
    const [probability, setProbability] = useState("BAJO");
    const [operationalType, setOperationalType] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [justification, setJustification] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchReport = async () => {

        try {

            const response =
                await fetch(
                    `${API_URL}/api/reports/${id}`
                );

            const data =
                await response.json();

            setReport(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchReport();

    }, [id]);

    const updateStatus = async (status: string) => {
        try {
            await fetch(`${API_URL}/api/reports/${report?.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });
            navigate("/operator");
        } catch (error) {
            console.error(error);
        }
    };

    const handlePrioritize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!operationalType || !targetDate || !justification) {
            alert("Por favor, completa todos los campos.");
            return;
        }
        setSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/api/reports/${id}/prioritize`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    impact,
                    probability,
                    operationalType,
                    targetDate,
                    justification,
                }),
            });
            if (response.ok) {
                alert("Reporte priorizado correctamente.");
                navigate("/operator");
            } else {
                const errData = await response.json();
                alert(`Error: ${errData.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("Hubo un error al procesar la priorización.");
        } finally {
            setSubmitting(false);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
                Cargando...
            </div>
        );
    }

    if (!report || report.message) {
        return (
            <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
                Reporte no encontrado
            </div>
        );
    }
    return (
        <div
            className="min-h-screen bg-[#F5F7FA] p-8">
            <div
                className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate("/operator")}
                    className="text-blue-600 font-semibold mb-8"
                >
                    ← Volver
                </button>
                <div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div
                        className="lg:col-span-2 bg-white rounded-3xl border shadow-sm p-8">
                        <div
                            className="flex items-start justify-between gap-6 mb-8">
                            <div>
                                <h1
                                    className="text-5xl font-bold text-[#03152E]">
                                    {report.problemType}
                                </h1>
                                <div
                                    className="mt-3 flex items-center gap-3 flex-wrap">
                                    <p
                                        className="text-lg font-semibold text-gray-700">
                                        {report.isAnonymous
                                            ? "Anónimo"
                                            : `${report.user?.firstName || ""} ${report.user?.lastName || ""}`}
                                    </p>
                                    <p className="text-gray-500">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <span
                                className="bg-yellow-100 text-yellow-700 px-5 py-3 rounded-full font-semibold">
                                {statusLabels[report.status as keyof typeof statusLabels] || report.status}
                            </span>
                        </div>
                        <img
                            src={
                                report.evidences && report.evidences.length > 0
                                    ? report.evidences[0].imageUrl
                                    : "https://placehold.co/1200x600?text=Sin+Evidencia"
                            }
                            alt={report.problemType}
                            className="w-full h-[400px] object-cover rounded-3xl mb-8"
                        />
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-3">
                                    Descripción
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {report.description}
                                </p>
                            </div>

                            <div>
                                <h2
                                    className="text-3xl font-bold mb-3">
                                    Ubicación
                                </h2>
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <p
                                        className="text-gray-500 mb-1">
                                        Dirección registrada
                                    </p>
                                    <p
                                        className="text-xl font-semibold">
                                        {report.address || "Ubicación no disponible"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border shadow-sm p-8 h-fit space-y-6">
                        {report.status === "REGISTERED" && (
                            <div className="space-y-4">
                                <h2
                                    className="text-2xl font-bold text-[#03152E]">
                                    Evaluar Reporte
                                </h2>
                                <p
                                    className="text-gray-500 text-sm">
                                    Revisa las evidencias antes de proceder.
                                </p>
                                <hr />
                                <button
                                    onClick={() => updateStatus("APPROVED")}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl p-4 text-xl font-semibold transition"
                                >
                                    Aprobar reporte
                                </button>
                                <button
                                    onClick={() => updateStatus("REJECTED")}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl p-4 text-xl font-semibold transition"
                                >
                                    Rechazar reporte
                                </button>
                            </div>
                        )}
                        {report.status === "APPROVED" && (
                            <form onSubmit={handlePrioritize}
                                className="space-y-5">
                                <h2
                                    className="text-2xl font-bold text-[#03152E] mb-2">
                                    Formulario de Priorización
                                </h2>
                                <hr />
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-gray-700 mb-1">
                                        Impacto del Problema
                                    </label>
                                    <select
                                        value={impact}
                                        onChange={(e) =>
                                            setImpact(e.target.value)}
                                        className="w-full p-3 rounded-xl border bg-gray-50 focus:outline-blue-500">
                                        <option
                                            value="BAJO">
                                            Bajo
                                        </option>
                                        <option
                                            value="MEDIO">
                                            Medio
                                        </option>
                                        <option
                                            value="ALTO">
                                            Alto
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-gray-700 mb-1">
                                        Probabilidad de Riesgo
                                    </label>
                                    <select
                                        value={probability}
                                        onChange={(e) => setProbability(e.target.value)}
                                        className="w-full p-3 rounded-xl border bg-gray-50 focus:outline-blue-500">
                                        <option
                                            value="BAJO">
                                            Bajo
                                        </option>
                                        <option
                                            value="MEDIO">
                                            Medio
                                        </option>
                                        <option
                                            value="ALTO">
                                            Alto
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-gray-700 mb-1">
                                        Tipo de Trabajo Operativo
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Bacheo de vía, Reemplazo de cables"
                                        value={operationalType}
                                        onChange={(e) =>
                                            setOperationalType(e.target.value)}
                                        className="w-full p-3 rounded-xl border bg-gray-50 focus:outline-blue-500" />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-gray-700 mb-1">
                                        Fecha Máxima de Atención
                                    </label>
                                    <input
                                        type="date"
                                        value={targetDate}
                                        onChange={(e) =>
                                            setTargetDate(e.target.value)}
                                        className="w-full p-3 rounded-xl border bg-gray-50 focus:outline-blue-500" />
                                </div>
                                <div>
                                    <label
                                        className=
                                        "block text-sm font-semibold text-gray-700 mb-1">
                                        Justificación de Prioridad
                                    </label>
                                    <textarea rows={3}
                                        placeholder="Sustente brevemente por qué se asigna este nivel de atención..."
                                        value={justification} onChange={(e) => setJustification(e.target.value)}
                                        className="w-full p-3 rounded-xl border bg-gray-50 focus:outline-blue-500 resize-none" />
                                </div>
                                <button type=
                                    "submit" disabled={submitting}
                                    className=
                                    "w-full bg-yellow-500 text-[#03152E] font-bold py-3 px-6 rounded-xl hover:bg-yellow-600 transition disabled:opacity-50">
                                    {submitting ? "Procesando..." : "Asignar Prioridad y Guardar"}
                                </button>
                            </form>
                        )}
                        {report.status !== "REGISTERED" && report.status !== "APPROVED" && (
                            <div className="bg-gray-50 p-6 rounded-2xl border text-center">
                                <h2 className="text-2xl font-bold text-[#03152E] mb-4">
                                    Resultado de Priorización
                                </h2>

                                <div className={`inline-block px-6 py-3 rounded-full text-xl font-black mb-6 border-2 ${report.priority === "ALTO" ? "bg-red-100 text-red-800 border-red-200" :
                                    report.priority === "MEDIO" ? "bg-orange-100 text-orange-800 border-orange-200" :
                                        report.priority === "BAJO" ? "bg-green-100 text-green-800 border-green-200" :
                                            "bg-gray-100 text-gray-800 border-gray-200"
                                    }`}>
                                    PRIORIDAD: {report.priority || "NO ASIGNADA"}
                                </div>

                                <div className="text-left bg-white p-4 rounded-xl border space-y-3">
                                    {report.operationalType && (
                                        <p className="text-gray-700">
                                            <strong className="text-[#03152E]">
                                                Tipo de trabajo:
                                            </strong> {report.operationalType}
                                        </p>
                                    )}
                                    {report.targetDate && (
                                        <p className="text-gray-700">
                                            <strong className="text-[#03152E]">
                                                Fecha máxima:
                                            </strong>
                                            {new Date(report.targetDate).toLocaleDateString()}
                                        </p>
                                    )}
                                    {report.justification && (
                                        <div>
                                            <strong className="text-[#03152E] text-sm">
                                                Justificación:
                                            </strong>
                                            <p className="text-gray-600 text-sm italic mt-1">
                                                "{report.justification}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {(
                            report.status === "PRIORITIZED" ||
                            report.status === "ASSIGNED"
                        ) && (
                                <AssignmentSection
                                    reportId={report.id}
                                    onAssigned={fetchReport}
                                    isReassignment={
                                        report.status === "ASSIGNED"
                                    }
                                />
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}