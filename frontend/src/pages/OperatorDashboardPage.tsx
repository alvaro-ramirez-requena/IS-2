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

    evidences: {

        imageUrl: string;

    }[];

    isAnonymous: boolean;

    user?: {

        firstName: string;

        lastName: string;
    };
};

export default function
    OperatorDashboardPage() {

    const navigate =
        useNavigate();

    const [reports, setReports] =
        useState<Report[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [selectedStatus,
        setSelectedStatus] =
        useState("REGISTERED");

    useEffect(() => {

        const fetchReports =
            async () => {

                try {

                    const response =
                        await fetch(

                            `${API_URL}/api/reports/status/${selectedStatus}`
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

    }, [selectedStatus]);

    const logout = () => {

        localStorage.clear();

        navigate("/login");
    };

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
                Cargando...
            </div>
        );
    }

    return (

        <div className="
            min-h-screen
            bg-[#F5F7FA]
            flex
        ">

            <aside className="
    w-[320px]
    h-screen
    sticky
    top-0
    bg-[#03152E]
    text-white
    p-8
    flex
    flex-col
    justify-between
">

                <div>

                    <h1 className="
                        text-4xl
                        font-bold
                        mb-14
                    ">
                        reporta
                        <span className="
                            text-yellow-400
                        ">
                            Ya
                        </span>
                    </h1>

                    <div className="
                        space-y-4
                    ">

                        <button

                            onClick={() =>
                                setSelectedStatus(
                                    "REGISTERED"
                                )
                            }

                            className="
                                w-full
                                text-left
                                p-4
                                rounded-2xl
                                bg-white/10
                                hover:bg-white/20
                                transition
                            "
                        >

                            Pendientes

                        </button>

                        <button

                            onClick={() =>
                                setSelectedStatus(
                                    "APPROVED"
                                )
                            }

                            className="
                                w-full
                                text-left
                                p-4
                                rounded-2xl
                                bg-white/10
                                hover:bg-white/20
                                transition
                            "
                        >

                            Aprobados

                        </button>

                        <button

                            onClick={() =>
                                setSelectedStatus(
                                    "REJECTED"
                                )
                            }

                            className="
                                w-full
                                text-left
                                p-4
                                rounded-2xl
                                bg-white/10
                                hover:bg-white/20
                                transition
                            "
                        >

                            Rechazados

                        </button>

                    </div>

                </div>

                <button

                    onClick={logout}

                    className="
                        w-full
                        bg-red-700
                        hover:bg-red-800
                        rounded-2xl
                        p-4
                        transition
                    "
                >

                    Cerrar sesión

                </button>

            </aside>

            <main className="
                flex-1
                p-8
                overflow-y-auto
            ">

                <h2 className="
                    text-5xl
                    font-bold
                    mb-4
                ">

                    Gestión de reportes

                </h2>

                <p className="
                    text-gray-500
                    text-xl
                    mb-10
                ">

                    Supervisión municipal

                </p>

                {
                    reports.length === 0

                        ? (

                            <div className="
                                bg-white
                                rounded-3xl
                                p-10
                                border
                            ">

                                No existen reportes.

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
                                                    lg:flex-row
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
                                                        lg:w-[260px]
                                                        h-[220px]
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

                                                            <h3 className="
                                                                text-3xl
                                                                font-bold
                                                            ">

                                                                {
                                                                    report.problemType
                                                                }

                                                            </h3>

                                                            <div className="
    mt-2
    flex
    items-center
    gap-3
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

                                                                <p className="
        text-gray-500
    ">

                                                                    {
                                                                        getRelativeTime(
                                                                            report.createdAt
                                                                        )
                                                                    }

                                                                </p>

                                                            </div>

                                                        </div>

                                                        <span className="
                                                            bg-yellow-100
                                                            text-yellow-700
                                                            px-4
                                                            py-2
                                                            rounded-full
                                                            font-semibold
                                                        ">

                                                            {
                                                                statusLabels[
                                                                report.status
                                                                ]
                                                            }

                                                        </span>

                                                    </div>

                                                    <div className="
    mt-6
    flex
    items-end
    justify-between
    gap-6
">

                                                        <p className="
        text-lg
        text-gray-600
        line-clamp-3
        flex-1
    ">

                                                            {
                                                                report.description
                                                            }

                                                        </p>

                                                        <button

                                                            onClick={() =>

                                                                navigate(

                                                                    `/operator/report/${report.id}`
                                                                )
                                                            }

                                                            className="
            text-blue-600
            font-semibold
            hover:underline
            whitespace-nowrap
        "
                                                        >

                                                            Ver detalle →

                                                        </button>

                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    )
                                }

                            </div>
                        )
                }

            </main>

        </div>
    );
}