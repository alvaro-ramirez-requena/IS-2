import {
    useNavigate,
} from "react-router-dom";

const adminOptions = [
    {
        title: "Catálogo operativo",
        description:
            "Administra categorías y tipos de problema usados por los reportes ciudadanos.",
        path: "/admin/catalog",
        icon: "C",
    },
    {
        title: "Gestión de SLA",
        description:
            "Configura tiempos objetivo según la prioridad del reporte.",
        path: "/admin/sla",
        icon: "S",
    },
    {
        title: "Motivos de cierre",
        description:
            "Administra los resultados posibles del cierre operativo técnico.",
        path: "/admin/closure-reasons",
        icon: "M",
    },
    {
        title: "Habilidades técnicas",
        description:
            "Administra las habilidades que pueden seleccionar los técnicos durante su postulación.",
        path: "/admin/technician-skills",
        icon: "H",
    },
    {
        title: "Municipalidades y operadores",
        description:
            "Registra municipalidades y crea operadores asociados para gestionar reportes.",
        path: "/admin/municipalities-operators",
        icon: "O",
    },
    {
        title: "Retención de reportes",
        description:
            "Configura cuántos días permanecen visibles los reportes resueltos.",
        path: "/admin/report-retention",
        icon: "R",
    },
];

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
                        {adminOptions.map((option) => (
                            <button
                                key={option.path}
                                onClick={() =>
                                    navigate(option.path)
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
                                {option.title}
                            </button>
                        ))}
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
                    xl:grid-cols-3
                    gap-6
                ">
                    {adminOptions.map((option) => (
                        <button
                            key={option.path}
                            onClick={() =>
                                navigate(option.path)
                            }
                            className="
                                bg-white
                                border
                                rounded-3xl
                                p-8
                                text-left
                                hover:shadow-md
                                hover:-translate-y-1
                                transition
                                min-h-[220px]
                            "
                        >
                            <div className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-blue-50
                                text-blue-700
                                flex
                                items-center
                                justify-center
                                font-black
                                text-xl
                                mb-6
                            ">
                                {option.icon}
                            </div>

                            <h3 className="
                                text-2xl
                                font-bold
                                text-[#03152E]
                                mb-3
                            ">
                                {option.title}
                            </h3>

                            <p className="
                                text-gray-500
                                leading-relaxed
                            ">
                                {option.description}
                            </p>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}