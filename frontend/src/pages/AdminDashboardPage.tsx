import {
    useNavigate,
} from "react-router-dom";

export default function AdminDashboardPage() {
    const navigate =
        useNavigate();

    const firstName =
        localStorage.getItem("firstName") ||
        "Administrador";

    const logout =
        () => {
            localStorage.clear();
            navigate("/login");
        };

    return (
        <div className="
            min-h-screen
            bg-[#F5F7FA]
            flex
        ">
            <aside className="
                w-[280px]
                bg-[#03152E]
                text-white
                min-h-screen
                p-7
                flex
                flex-col
                justify-between
            ">
                <div>
                    <h1 className="
                        text-3xl
                        font-bold
                        mb-12
                    ">
                        reporta
                        <span className="text-yellow-400">
                            Ya
                        </span>
                    </h1>

                    <p className="
                        text-white/50
                        text-xs
                        uppercase
                        tracking-wide
                        mb-3
                    ">
                        Panel administrador
                    </p>

                    <nav className="
                        space-y-4
                    ">
                        <button
                            onClick={() =>
                                navigate("/admin/catalog")
                            }
                            className="
                                w-full
                                text-left
                                rounded-xl
                                px-4
                                py-4
                                font-semibold
                                bg-white/10
                                hover:bg-white/20
                                transition
                            "
                        >
                            Catálogo operativo
                        </button>

                        <button
                            onClick={() =>
                                navigate("/admin/sla")
                            }
                            className="
                                w-full
                                text-left
                                rounded-xl
                                px-4
                                py-4
                                font-semibold
                                bg-white/10
                                hover:bg-white/20
                                transition
                            "
                        >
                            Gestión de SLA
                        </button>

                        <button
                            onClick={() =>
                                navigate("/admin/closure-reasons")
                            }
                            className="
                                w-full
                                text-left
                                rounded-xl
                                px-4
                                py-4
                                font-semibold
                                bg-white/10
                                hover:bg-white/20
                                transition
                            "
                        >
                            Motivos de cierre
                        </button>

                        <button
                            onClick={() =>
                                navigate("/admin/technician-skills")
                            }
                            className="
                                w-full
                                text-left
                                rounded-xl
                                px-4
                                py-4
                                font-semibold
                                bg-white/10
                                hover:bg-white/20
                                transition
                            "
                        >
                            Habilidades técnicas
                        </button>
                    </nav>
                </div>

                <button
                    onClick={logout}
                    className="
                        w-full
                        bg-red-600
                        hover:bg-red-700
                        rounded-xl
                        px-4
                        py-4
                        font-bold
                    "
                >
                    Cerrar sesión
                </button>
            </aside>

            <main className="
                flex-1
                p-10
            ">
                <p className="
                    text-blue-700
                    font-bold
                    mb-2
                ">
                    Administración del sistema
                </p>

                <h2 className="
                    text-5xl
                    font-bold
                    text-[#03152E]
                ">
                    Bienvenido, {firstName}
                </h2>

                <p className="
                    text-gray-500
                    text-lg
                    mt-4
                    mb-10
                ">
                    Gestiona configuraciones globales de ReportaYa.
                </p>

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-6
                ">
                    <button
                        onClick={() =>
                            navigate("/admin/catalog")
                        }
                        className="
                            bg-white
                            border
                            rounded-3xl
                            p-8
                            text-left
                            hover:shadow-md
                            transition
                        "
                    >
                        <h3 className="
                            text-2xl
                            font-bold
                            text-[#03152E]
                            mb-3
                        ">
                            Catálogo operativo
                        </h3>

                        <p className="
                            text-gray-500
                        ">
                            Administra categorías y tipos de problema usados
                            por los reportes ciudadanos.
                        </p>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/sla")
                        }
                        className="
                            bg-white
                            border
                            rounded-3xl
                            p-8
                            text-left
                            hover:shadow-md
                            transition
                        "
                    >
                        <h3 className="
                            text-2xl
                            font-bold
                            text-[#03152E]
                            mb-3
                        ">
                            Gestión de SLA
                        </h3>

                        <p className="
                            text-gray-500
                        ">
                            Configura tiempos objetivo según la prioridad del
                            reporte.
                        </p>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/closure-reasons")
                        }
                        className="
                            bg-white
                            border
                            rounded-3xl
                            p-8
                            text-left
                            hover:shadow-md
                            transition
                        "
                    >
                        <h3 className="
                            text-2xl
                            font-bold
                            text-[#03152E]
                            mb-3
                        ">
                            Motivos de cierre
                        </h3>

                        <p className="
                            text-gray-500
                        ">
                            Administra los resultados posibles del cierre
                            operativo técnico.
                        </p>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/technician-skills")
                        }
                        className="
                            bg-white
                            border
                            rounded-3xl
                            p-8
                            text-left
                            hover:shadow-md
                            transition
                        "
                    >
                        <h3 className="
                            text-2xl
                            font-bold
                            text-[#03152E]
                            mb-3
                        ">
                            Habilidades técnicas
                        </h3>

                        <p className="
                            text-gray-500
                        ">
                            Administra las habilidades que pueden seleccionar
                            los técnicos durante su postulación.
                        </p>
                    </button>
                </div>
            </main>
        </div>
    );
}