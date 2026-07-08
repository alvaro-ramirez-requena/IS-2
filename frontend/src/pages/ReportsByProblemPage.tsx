import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    statusLabels,
} from "../utils/reportLabels";

import { ReportFollowService } from "../services/reportFollow.service";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

type Report = {

    id: string;

    userId: string;

    title: string;

    problemType: string;

    description: string;

    isAnonymous: boolean;

    latitude?: number;

    longitude?: number;

    createdAt: string;

    address?: string;

    status: string;

    evidences: {

        imageUrl: string;

    }[];

    user?: {

        firstName: string;

        lastName: string;
    };
};

export default function
    ReportsByProblemPage() {

    const { problemType } =
        useParams();

    const navigate =
        useNavigate();

    const [searchParams] =
        useSearchParams();

    const highlightedReportId =
        searchParams.get("highlight");

    const [reports, setReports] =
        useState<Report[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [isFollowingSelectedReport, setIsFollowingSelectedReport] =
        useState(false);

    const [followMessage, setFollowMessage] =
        useState("");

    const handleToggleFollow = async () => {

        if (!selectedReport) {
            return;
        }

    const userId =
        localStorage.getItem("userId");

        if (!userId) {
            alert(
                "Debes iniciar sesión para seguir este reporte."
            );
            return;
        }

        try {

            setFollowMessage("");

            if (isFollowingSelectedReport) {

                await ReportFollowService
                    .unfollowReport(
                        userId,
                        selectedReport.id
                    );

                setIsFollowingSelectedReport(false);

                setFollowMessage(
                    "Dejaste de seguir este reporte."
                );

            } else {

                await ReportFollowService
                    .followReport(
                        userId,
                        selectedReport.id
                    );

                setIsFollowingSelectedReport(true);

                setFollowMessage(
                    "Ahora sigues este reporte."
                );
            }

        } catch (error: any) {

            setFollowMessage(
                error?.message ||
                "No se pudo actualizar el seguimiento."
            );
        }
    };
    const [selectedReport, setSelectedReport] =
        useState<Report | null>(null);

        useEffect(() => {

            const fetchReports =
                async () => {

                    try {

                        const response =
                            await fetch(

                                `${API_URL}/api/reports/problem/${problemType}`
                            );

                        const data =
                            await response.json();



                        setReports(data);



                    } catch (error) {

                        console.error(error);

                    } finally {

                        setLoading(false);
                    }
                };

            fetchReports();

        }, [problemType]);

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
                    Cargando reportes...
                </div>
            );
        }

        return (

            <div className="
                min-h-screen
                bg-[#F5F7FA]
                p-4
                lg:p-10
            ">
                
                <div className="
                max-w-7xl
                mx-auto
                ">

                    <button

                        onClick={() =>
                            navigate("/home")
                        }

                        className="
                        mb-8
                        text-blue-700
                        font-semibold
                        hover:underline
                        "
                    >
                        ← Volver al inicio
                    </button>

                    <h1 className="
                        text-4xl
                        lg:text-5xl
                        font-bold
                        mb-3
                    ">
                        {decodeURIComponent(
                            problemType || ""
                        )}
                    </h1>

                    <p className="
                        text-gray-500
                        text-lg
                        lg:text-xl
                        mb-10
                    ">
                        {
                            reports.length
                        } reportes encontrados
                    </p>

                    {reports.length === 0 ? (

                        <div className="
                        bg-white
                        rounded-3xl
                        p-16
                        text-center
                        shadow-sm
                        border
                        ">

                            <h2 className="
                                text-3xl
                                font-bold
                                mb-4
                            ">
                                No hay reportes
                            </h2>

                            <p className="
                                text-gray-500
                                text-lg
                            ">
                                Todavía no existen
                                reportes para este
                                tipo de problema.
                            </p>

                        </div>

                    ) : (

                        <div className="
                        space-y-6
                        ">

                            {reports.map((report) => {

    const isHighlighted =
        report.id === highlightedReportId;

    return (

        <div
            key={report.id}
            className={`
                bg-white
                rounded-3xl
                border
                overflow-hidden
                shadow-sm
                hover:shadow-md
                transition
                flex
                flex-col
                md:flex-row
                ${isHighlighted
                    ? "ring-4 ring-blue-500 border-blue-500 bg-blue-50"
                    : ""
                }
            `}
        >

                                <div className="
                                    md:w-[320px]
                                    h-[240px]
                                    bg-gray-200
                                    flex-shrink-0
                                ">

                                    <img

                                        src={
                                            report.evidences[0]
                                                ?.imageUrl ||

                                            "https://placehold.co/600x400?text=Sin+imagen"
                                        }

                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                        "
                                    />

                                </div>

                                <div className="
                                    flex-1
                                    p-6
                                    lg:p-8
                                ">
                                    {isHighlighted && (

                                        <div className="
                                            mb-4
                                            bg-blue-100
                                            text-blue-700
                                            px-4
                                            py-3
                                            rounded-xl
                                            font-semibold
                                        ">
                                            Cambio reciente: este reporte ahora está como {
                                                statusLabels[
                                                    report.status
                                                ]
                                            }.
                                        </div>
                                    )}


                                    <div className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
                                    ">

                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {report.title || report.problemType}
                                            </h2>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {report.problemType}
                                            </p>
                                        </div>

                                        <div className="
                                            px-4
                                            py-2
                                            rounded-full
                                            text-sm
                                            font-semibold
                                            bg-yellow-100
                                            text-yellow-700
                                            whitespace-nowrap
                                        ">
                                            {
                                                statusLabels[
                                                    report.status
                                                ]
                                            }
                                        </div>

                                    </div>

                                    <p className="
                                        mt-5
                                        text-gray-600
                                        text-lg
                                        leading-relaxed
                                    ">
                                        {report.description}
                                    </p>

                                    <div className="
                                        mt-5
                                        bg-gray-50
                                        rounded-2xl
                                        p-4
                                    ">

                                        <p className="
                                            text-sm
                                            text-gray-500
                                            mb-1
                                        ">
                                            Ubicación
                                        </p>

                                        <p className="
                                            text-gray-700
                                            font-medium
                                            leading-relaxed
                                        ">

                                            {
                                                report.address
                                                || "Ubicación no disponible"
                                            }

                                        </p>

                                    </div>

                                    <div className="
                                            mt-8
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            flex-wrap
                                        ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-4
                                            text-gray-400
                                            flex-wrap
                                        ">

                                            <p className="
                                                font-semibold
                                                text-gray-700
                                            ">

                                                {
                                                    report.isAnonymous

                                                        ? "Anónimo"

                                                        : `${report.user?.firstName || ""} ${report.user?.lastName || ""}`
                                                }

                                            </p>

                                            <p>
                                                {
                                                    new Date(
                                                        report.createdAt
                                                    ).toLocaleDateString()
                                                }
                                            </p>

                                            <p>

                                                {
                                                    (() => {

                                                        const diffMs =
                                                            Date.now() -

                                                            new Date(
                                                                report.createdAt
                                                            ).getTime();

                                                        const minutes =
                                                            Math.floor(
                                                                diffMs / (1000 * 60)
                                                            );

                                                        const hours =
                                                            Math.floor(
                                                                minutes / 60
                                                            );

                                                        const days =
                                                            Math.floor(
                                                                hours / 24
                                                            );

                                                        if (minutes < 60) {

                                                            return `Hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
                                                        }

                                                        if (hours < 24) {

                                                            return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;
                                                        }

                                                        return `Hace ${days} día${days !== 1 ? "s" : ""}`;

                                                    })()
                                                }

                                            </p>

                                        </div>

                                        <button
                                        onClick={async () => {
                                        setSelectedReport(report);
                                        setFollowMessage("");

                                        const userId =
                                            localStorage.getItem("userId");

                                        if (userId) {
                                            try {
                                                const result =
                                                    await ReportFollowService
                                                        .isFollowing(
                                                            userId,
                                                            report.id
                                                        );

                                                setIsFollowingSelectedReport(
                                                    result.isFollowing
                                                );
                                            } catch {
                                                setIsFollowingSelectedReport(false);
                                            }
                                        } else {
                                            setIsFollowingSelectedReport(false);
                                        }
                                    }}
                                        className="
                                            text-blue-700
                                            font-semibold
                                            hover:underline
                                        "
                                        >
                                        Ver detalle →
                                        </button>
                                    </div>

                                </div>

                                    </div>
                                    );
                                })}

                    </div>
                )}

                        </div>

            {
                selectedReport && (

                    <div className="
                        fixed
                        inset-0
                        bg-black/50
                        z-50
                        flex
                        items-center
                        justify-center
                        p-4
                    ">

                        <div className="
                            bg-white
                            rounded-3xl
                            max-w-5xl
                            w-full
                            max-h-[90vh]
                            overflow-y-auto
                            p-8
                            relative
                        ">

                            <button
                                onClick={() => setSelectedReport(null)}
                                className="
                                    absolute
                                    top-5
                                    right-6
                                    text-3xl
                                    font-bold
                                    text-gray-400
                                    hover:text-gray-700
                                "
                            >
                                ×
                            </button>

                            <h2 className="text-4xl font-bold mb-2 pr-10">
                            {selectedReport.title || selectedReport.problemType}
                            </h2>

                            <p className="text-gray-500 mb-4">
                            {selectedReport.problemType}
                            </p>

                            <div className="
                                mb-6
                                inline-block
                                px-4
                                py-2
                                rounded-full
                                bg-yellow-100
                                text-yellow-700
                                font-semibold
                            ">
                                {
                                    statusLabels[
                                        selectedReport.status
                                    ]
                                }
                            </div>

                                {
                                selectedReport.userId !== localStorage.getItem("userId") && (

                                    <div className="
                                        mb-6
                                        flex
                                        flex-col
                                        sm:flex-row
                                        sm:items-center
                                        gap-3
                                    ">

            <button
                    onClick={handleToggleFollow}
                    className="
                        px-5
                        py-3
                        rounded-full
                        border
                        font-semibold
                        hover:bg-gray-50
                        transition
                    "
                >
                    {
                        isFollowingSelectedReport
                            ? "✓ Siguiendo reporte"
                            : "📌 Seguir reporte"
                    }
                </button>

                {followMessage && (
                    <p className="
                        text-sm
                        text-blue-700
                        font-semibold
                    ">
                        {followMessage}
                    </p>
                )}

            </div>
        )
    }
                            <div className="
                                grid
                                grid-cols-1
                                lg:grid-cols-2
                                gap-8
                            ">

                                <div>

                                    <img
                                        src={
                                            selectedReport.evidences[0]
                                                ?.imageUrl ||
                                            "https://placehold.co/600x400?text=Sin+imagen"
                                        }
                                        className="
                                            w-full
                                            h-[360px]
                                            object-cover
                                            rounded-2xl
                                            border
                                        "
                                    />

                                    <div className="
                                        mt-6
                                        bg-gray-50
                                        rounded-2xl
                                        p-5
                                    ">

                                        <p className="
                                            text-sm
                                            text-gray-500
                                            mb-2
                                        ">
                                            Descripción
                                        </p>

                                        <p className="
                                            text-lg
                                            text-gray-700
                                            leading-relaxed
                                        ">
                                            {selectedReport.description}
                                        </p>

                                    </div>

                                    <div className="
                                        mt-6
                                        flex
                                        flex-wrap
                                        gap-4
                                        text-gray-500
                                    ">

                                        <p className="font-semibold text-gray-700">
                                            {
                                                selectedReport.isAnonymous
                                                    ? "Anónimo"
                                                    : `${selectedReport.user?.firstName || ""} ${selectedReport.user?.lastName || ""}`
                                            }
                                        </p>

                                        <p>
                                            {
                                                new Date(
                                                    selectedReport.createdAt
                                                ).toLocaleDateString()
                                            }
                                        </p>

                                    </div>

                                </div>

                                <div>

                                    <div className="
                                        bg-green-50
                                        rounded-2xl
                                        p-6
                                        space-y-5
                                    ">

                                        <div>

                                            <p className="
                                                text-green-700
                                                font-semibold
                                                text-lg
                                            ">
                                                Ubicación del reporte
                                            </p>

                                            <p className="
                                                text-gray-700
                                                mt-2
                                                leading-relaxed
                                            ">
                                                {
                                                    selectedReport.address ||
                                                    "Ubicación no disponible"
                                                }
                                            </p>

                                            {
                                                selectedReport.latitude &&
                                                selectedReport.longitude && (

                                                    <p className="
                                                        text-gray-500
                                                        mt-2
                                                        text-sm
                                                    ">
                                                        Latitud: {selectedReport.latitude} | Longitud: {selectedReport.longitude}
                                                    </p>
                                                )
                                            }

                                        </div>

                                        {
                                            selectedReport.latitude &&
                                            selectedReport.longitude ? (

                                                <>

                                                    <iframe
                                                        title="Ubicación del reporte"
                                                        width="100%"
                                                        height="320"
                                                        loading="lazy"
                                                        className="
                                                            rounded-2xl
                                                            border
                                                        "
                                                        src={`https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}&z=17&output=embed`}
                                                    />

                                                    <a
                                                        href={`https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="
                                                            inline-block
                                                            text-blue-700
                                                            font-semibold
                                                            hover:underline
                                                        "
                                                    >
                                                        Abrir ubicación en Google Maps
                                                    </a>

                                                </>

                                            ) : (

                                                <p className="
                                                    text-gray-500
                                                ">
                                                    Este reporte no tiene coordenadas registradas.
                                                </p>
                                            )
                                        }

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                )
            }

        </div>
    );
}