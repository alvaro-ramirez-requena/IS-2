import {
    useEffect,
    useState,
} from "react";

import {
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

    createdAt: string;

    address?: string;

    evidences: {

        imageUrl: string;

    }[];
};

export default function MyReportsPage() {

    const navigate =
        useNavigate();

    const [reports, setReports] =
        useState<Report[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchReports =
            async () => {

                try {

                    const userId =
                        localStorage.getItem(
                            "userId"
                        );

                    if (!userId) {
                        return;
                    }

                    const response =
                        await fetch(

                            `${API_URL}/api/reports/user/${userId}`
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

    }, []);

    const getRelativeTime = (
        date: string
    ) => {

        const now =
            new Date().getTime();

        const created =
            new Date(date).getTime();

        const diff =
            now - created;

        const minutes =
            Math.floor(
                diff / 1000 / 60
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

            return `Hace ${minutes} min`;
        }

        if (hours < 24) {

            return `Hace ${hours} horas`;
        }

        return `Hace ${days} días`;
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
                Cargando reportes...
            </div>
        );
    }

    return (

        <div className="
            min-h-screen
            bg-[#F5F7FA]
            p-6
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
                    text-5xl
                    font-bold
                    mb-4
                ">
                    Mis reportes
                </h1>

                <p className="
                    text-gray-500
                    text-xl
                    mb-10
                ">
                    Consulta el estado de
                    tus reportes
                </p>

                {
                    reports.length === 0
                        ? (

                            <div className="
                                bg-white
                                rounded-3xl
                                p-10
                                shadow-sm
                                border
                            ">

                                No tienes reportes aún.

                            </div>
                        )

                        : (

                            <div className="
                                space-y-6
                            ">

                                {
                                    reports.map(
                                        (report) => (

                                            <div
                                                key={report.id}

                                                className="
                                                    bg-white
                                                    rounded-3xl
                                                    border
                                                    p-5
                                                    flex
                                                    flex-col
                                                    md:flex-row
                                                    gap-6
                                                    shadow-sm
                                                "
                                            >

                                                <img

                                                    src={
                                                        report.evidences?.[0]
                                                            ?.imageUrl ||

                                                        "https://placehold.co/600x400"
                                                    }

                                                    alt={
                                                        report.problemType
                                                    }

                                                    className="
                                                        w-full
                                                        md:w-[220px]
                                                        h-[180px]
                                                        object-cover
                                                        rounded-2xl
                                                    "
                                                />

                                                <div className="
                                                    flex-1
                                                ">

                                                    <div className="
                                                        flex
                                                        items-start
                                                        justify-between
                                                        gap-4
                                                    ">

                                                        <div>

                                                            <h2 className="
                                                                text-3xl
                                                                font-bold
                                                            ">
                                                                {
                                                                    report.problemType
                                                                }
                                                            </h2>

                                                            <p className="
                                                                text-gray-500
                                                                mt-2
                                                            ">
                                                                {
                                                                    getRelativeTime(
                                                                        report.createdAt
                                                                    )
                                                                }
                                                            </p>

                                                        </div>

                                                        <span className="
                                                            bg-yellow-100
                                                            text-yellow-700
                                                            px-4
                                                            py-2
                                                            rounded-full
                                                            text-sm
                                                            font-semibold
                                                        ">

                                                            {
                                                                statusLabels[
                                                                report.status
                                                                ]
                                                            }

                                                        </span>

                                                    </div>

                                                    <p className="
                                                        mt-6
                                                        text-gray-600
                                                        text-lg
                                                        line-clamp-3
                                                    ">

                                                        {
                                                            report.description
                                                        }

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
    ">

                                                            {
                                                                report.address
                                                                || "Ubicación no disponible"
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    )
                                }

                            </div>
                        )
                }

            </div>

        </div>
    );
}