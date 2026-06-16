import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

type Report = {

    id: string;

    problemType: string;

    description: string;

    status: string;

    createdAt: string;

    latitude?: number;

    longitude?: number;

    evidences: {

        imageUrl: string;

    }[];
};

export default function
    OperatorReportDetailPage() {

    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const [report, setReport] =
        useState<Report | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchReport =
            async () => {

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

        fetchReport();

    }, [id]);

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

    const updateStatus =
        async (
            status: string
        ) => {

            try {

                await fetch(

                    `${API_URL}/api/reports/${report?.id}/status`,

                    {

                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            status,
                        }),
                    }
                );

                navigate("/operator");

            } catch (error) {

                console.error(error);
            }
        };

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
                Reporte no encontrado
            </div>
        );
    }

    return (

        <div className="
            min-h-screen
            bg-[#F5F7FA]
            p-8
        ">

            <div className="
                max-w-7xl
                mx-auto
            ">

                <button

                    onClick={() =>
                        navigate("/operator")
                    }

                    className="
                        text-blue-600
                        font-semibold
                        mb-8
                    "
                >

                    ← Volver

                </button>

                <div className="
                    bg-white
                    rounded-3xl
                    border
                    shadow-sm
                    p-8
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                        gap-6
                        mb-8
                    ">

                        <div>

                            <h1 className="
                                text-5xl
                                font-bold
                            ">

                                {
                                    report.problemType
                                }

                            </h1>



                        </div>

                        <span className="
                            bg-yellow-100
                            text-yellow-700
                            px-5
                            py-3
                            rounded-full
                            font-semibold
                        ">

                            {
                                report.status
                            }

                        </span>

                    </div>

                    <img

                        src={
                            report.evidences?.[0]
                                ?.imageUrl ||

                            "https://placehold.co/1200x600"
                        }

                        alt={
                            report.problemType
                        }

                        className="
                            w-full
                            h-[500px]
                            object-cover
                            rounded-3xl
                        "
                    />

                    <div className="
                        mt-10
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-10
                    ">

                        <div>

                            <h2 className="
                                text-3xl
                                font-bold
                                mb-6
                            ">

                                Descripción

                            </h2>

                            <p className="
                                text-lg
                                text-gray-600
                                leading-relaxed
                            ">

                                {
                                    report.description
                                }

                            </p>

                        </div>

                        <div>

                            <div className="
    mb-10
">

                                <h2 className="
        text-3xl
        font-bold
        mb-4
    ">

                                    Ubicación

                                </h2>

                                <p className="
        text-lg
        text-gray-600
    ">

                                    Latitud:
                                    {" "}
                                    {
                                        report.latitude
                                    }

                                </p>

                                <p className="
        text-lg
        text-gray-600
        mt-2
    ">

                                    Longitud:
                                    {" "}
                                    {
                                        report.longitude
                                    }

                                </p>

                            </div>

                            <h2 className="
                                text-3xl
                                font-bold
                                mb-6
                            ">

                                Evidencias

                            </h2>

                            <div className="
                                flex
                                gap-4
                                flex-wrap
                            ">

                                {
                                    report.evidences?.map(
                                        (
                                            evidence,
                                            index
                                        ) => (

                                            <img

                                                key={index}

                                                src={
                                                    evidence.imageUrl
                                                }

                                                alt="evidence"

                                                className="
                                                    w-[150px]
                                                    h-[150px]
                                                    rounded-2xl
                                                    object-cover
                                                "
                                            />
                                        )
                                    )
                                }

                            </div>

                        </div>

                    </div>

                    <div className="
                        mt-14
                        flex
                        gap-6
                    ">

                        <button

                            onClick={() =>
                                updateStatus(
                                    "APPROVED"
                                )
                            }

                            className="
        flex-1
        bg-green-600
                            hover:bg-green-700
                            text-white
                            rounded-2xl
                            p-5
                            text-xl
                            font-semibold
                            transition
                        ">

                            Aprobar reporte

                        </button>

                        <button

                            onClick={() =>
                                updateStatus(
                                    "REJECTED"
                                )
                            }

                            className="
        flex-1
        bg-red-600
                            hover:bg-red-700
                            text-white
                            rounded-2xl
                            p-5
                            text-xl
                            font-semibold
                            transition
                        ">

                            Rechazar reporte

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}