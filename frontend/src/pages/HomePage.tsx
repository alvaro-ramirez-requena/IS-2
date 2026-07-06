import Navbar
    from "../components/home/Navbar";

import ProblemBanner
    from "../components/home/ProblemBanner";

import CategorySection
    from "../components/home/CategorySection";

import {
    useNavigate,
} from "react-router-dom";

export default function HomePage() {

    const navigate = useNavigate();

    const token =
        localStorage.getItem("token");

    const firstName =
        localStorage.getItem("firstName");

    const handleCreateReport = () => {

        if (!token) {
            navigate("/login");
            return;
        }

        navigate("/reports/create");
    };

    const handleMyReports = () => {

        if (!token) {
            navigate("/login");
            return;
        }

        navigate("/my-reports");
    };

    return (

        <div className="
            min-h-screen
            bg-[#F5F7FA]
        ">

            <Navbar />

            <main className="
                max-w-[1700px]
                mx-auto
                px-12
                py-10
                space-y-16
            ">

                <section className="
                    bg-white
                    rounded-3xl
                    shadow-sm
                    border
                    p-10
                    flex
                    flex-col
                    lg:flex-row
                    justify-between
                    gap-8
                    items-start
                    lg:items-center
                ">

                    <div>

                        <p className="
                            text-sm
                            font-semibold
                            text-blue-700
                            mb-3
                        ">
                            Plataforma ciudadana
                        </p>

                        <h1 className="
                            text-4xl
                            lg:text-5xl
                            font-bold
                            text-[#03152E]
                            leading-tight
                        ">
                            {
                                token
                                    ? `Bienvenido, ${firstName ?? "ciudadano"}`
                                    : "Bienvenido a ReportaYa"
                            }
                        </h1>

                        <p className="
                            mt-5
                            text-lg
                            text-gray-600
                            max-w-3xl
                        ">
                            Reporta problemas de tu comunidad, consulta el estado
                            de tus reportes y ayuda a mejorar tu distrito.
                        </p>

                    </div>

                    <div className="
                        flex
                        flex-wrap
                        gap-4
                    ">

                        {!token && (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="
                                        bg-[#03152E]
                                        hover:bg-[#09213f]
                                        text-white
                                        px-7
                                        py-3
                                        rounded-full
                                        font-semibold
                                        transition
                                    "
                                >
                                    Iniciar sesión
                                </button>

                                <button
                                    onClick={() => navigate("/register")}
                                    className="
                                        bg-white
                                        hover:bg-gray-50
                                        border
                                        border-[#03152E]
                                        text-[#03152E]
                                        px-7
                                        py-3
                                        rounded-full
                                        font-semibold
                                        transition
                                    "
                                >
                                    Registrarse
                                </button>
                            </>
                        )}

                    </div>

                </section>

                <ProblemBanner />

                <div className="
                    flex
                    flex-wrap
                    justify-center
                    gap-6
                    mb-12
                ">

                    <button
                        onClick={handleCreateReport}
                        className="
                            bg-red-700
                            hover:bg-red-800
                            text-white
                            rounded-2xl
                            p-6
                            text-left
                            transition
                            w-full
                            sm:w-[320px]
                        "
                    >

                        <p className="
                            text-4xl
                            font-bold
                        ">
                            +
                        </p>

                        <h3 className="
                            text-2xl
                            font-semibold
                            mt-4
                        ">
                            Crear reporte
                        </h3>

                        <p className="mt-2 text-red-100">
                            Reporta un problema en tu distrito
                        </p>

                    </button>

                    <button
                        onClick={handleMyReports}
                        className="
                            bg-white
                            hover:bg-gray-50
                            border
                            rounded-2xl
                            p-6
                            text-left
                            transition
                            w-full
                            sm:w-[320px]
                        "
                    >

                        <p className="
                            text-4xl
                            font-bold
                        ">
                            📄
                        </p>

                        <h3 className="
                            text-2xl
                            font-semibold
                            mt-4
                        ">
                            Mis reportes
                        </h3>

                        <p className="
                            mt-2
                            text-gray-500
                        ">
                            Consulta y da seguimiento
                        </p>

                    </button>

                </div>

                <CategorySection />

            </main>

        </div>
    );
}