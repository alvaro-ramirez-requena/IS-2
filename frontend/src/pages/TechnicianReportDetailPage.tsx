import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    statusLabels,
} from "../utils/reportLabels";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

type Report = {
    id: string;
    title?: string;
    problemType: string;
    description: string;
    status: string;
    priority?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    evidences?: {
        imageUrl: string;
    }[];
};

export default function TechnicianReportDetailPage() {
    const { id } =
        useParams();

    const navigate =
        useNavigate();

    const [report, setReport] =
        useState<Report | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const fetchReport =
        async () => {
            try {
                setLoading(true);

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

    const updateStatus =
        async (status: string) => {
            if (!report) {
                return;
            }

            try {
                setSubmitting(true);

                const response =
                    await fetch(
                        `${API_URL}/api/reports/${report.id}/status`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                status,
                            }),
                        }
                    );

                if (!response.ok) {
                    const error =
                        await response.json()
                            .catch(() => null);

                    throw new Error(
                        error?.message ||
                        "No se pudo actualizar el estado."
                    );
                }

                await fetchReport();

            } catch (error: any) {
                alert(
                    error.message ||
                    "No se pudo actualizar el estado."
                );

            } finally {
                setSubmitting(false);
            }
        };

    if (loading) {
        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                text-3xl
                font-bold
            ">
                Cargando...
            </div>
        );
    }

    if (!report) {
        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                text-3xl
                font-bold
            ">
                Trabajo no encontrado
            </div>
        );
    }

    const imageUrl =
        report.evidences?.[0]?.imageUrl ||
        "https://placehold.co/1200x600?text=Sin+evidencia";

    return (
        <div className="
            min-h-screen
            bg-[#F5F7FA]
            p-8
        ">
            <div className="
                max-w-6xl
                mx-auto
                space-y-8
            ">
                <button
                    onClick={() =>
                        navigate("/technician")
                    }
                    className="
                        text-blue-700
                        font-bold
                    "
                >
                    ← Volver al panel técnico
                </button>

                <div className="
                    bg-white
                    border
                    rounded-3xl
                    p-8
                    shadow-sm
                    space-y-8
                ">
                    <div className="
                        flex
                        justify-between
                        gap-6
                        items-start
                    ">
                        <div>
                            <p className="
                                text-green-700
                                font-bold
                                mb-2
                            ">
                                Detalle del trabajo
                            </p>

                            <h1 className="
                                text-5xl
                                font-bold
                                text-[#03152E]
                            ">
                                {report.title || report.problemType}
                            </h1>

                            <p className="
                                text-gray-500
                                text-xl
                                mt-3
                            ">
                                {report.problemType}
                            </p>
                        </div>

                        <span className="
                            bg-blue-100
                            text-blue-700
                            rounded-full
                            px-5
                            py-3
                            font-bold
                        ">
                            {statusLabels[report.status] || report.status}
                        </span>
                    </div>

                    <img
                        src={imageUrl}
                        alt={report.problemType}
                        className="
                            w-full
                            h-[420px]
                            object-cover
                            rounded-3xl
                        "
                    />

                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-8
                    ">
                        <div>
                            <h2 className="
                                text-2xl
                                font-bold
                                mb-3
                            ">
                                Descripción
                            </h2>

                            <p className="
                                text-gray-700
                                leading-relaxed
                            ">
                                {report.description}
                            </p>
                        </div>

                        <div className="
                            bg-gray-50
                            border
                            rounded-2xl
                            p-6
                            space-y-3
                        ">
                            <h2 className="
                                text-2xl
                                font-bold
                            ">
                                Datos operativos
                            </h2>

                            <p>
                                <strong>Prioridad:</strong>{" "}
                                {report.priority || "No definida"}
                            </p>

                            <p>
                                <strong>Ubicación:</strong>{" "}
                                {report.address || "No registrada"}
                            </p>

                            {report.latitude && report.longitude && (
                                <a
                                    href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        inline-block
                                        text-blue-700
                                        font-bold
                                        hover:underline
                                    "
                                >
                                    Abrir en Google Maps
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="
                        bg-gray-50
                        border
                        rounded-2xl
                        p-6
                        space-y-4
                    ">
                        <h2 className="
                            text-2xl
                            font-bold
                            text-[#03152E]
                        ">
                            Acciones del técnico
                        </h2>

                        <div className="
                            flex
                            flex-wrap
                            gap-4
                        ">
                            {report.status === "ASSIGNED" && (
                                <button
                                    disabled={submitting}
                                    onClick={() =>
                                        updateStatus("IN_TRANSIT")
                                    }
                                    className="
                                        bg-yellow-500
                                        hover:bg-yellow-600
                                        disabled:bg-gray-400
                                        text-white
                                        rounded-xl
                                        px-5
                                        py-3
                                        font-bold
                                    "
                                >
                                    Iniciar traslado
                                </button>
                            )}

                            {report.status === "IN_TRANSIT" && (
                                <button
                                    disabled={submitting}
                                    onClick={() =>
                                        updateStatus("IN_PROGRESS")
                                    }
                                    className="
                                        bg-blue-700
                                        hover:bg-blue-800
                                        disabled:bg-gray-400
                                        text-white
                                        rounded-xl
                                        px-5
                                        py-3
                                        font-bold
                                    "
                                >
                                    Iniciar atención
                                </button>

                                
                            )}
                            {report.status === "IN_PROGRESS" && (
                                <div className="
                                    space-y-3
                                    mt-6
                                ">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/technician/reports/${report.id}/attend`
                                            )
                                        }
                                        className="
                                            w-full
                                            bg-green-700
                                            text-white
                                            font-bold
                                            rounded-2xl
                                            py-4
                                            hover:bg-green-800
                                            transition
                                        "
                                    >
                                        Atender reporte
                                    </button>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/technician/reports/${report.id}/fieldwork`
                                            )
                                        }
                                        className="
                                            w-full
                                            bg-blue-700
                                            text-white
                                            font-bold
                                            rounded-2xl
                                            py-4
                                            hover:bg-blue-800
                                            transition
                                        "
                                    >
                                        Registrar evidencia y trazabilidad
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}