import {
    useNavigate,
} from "react-router-dom";

export default function TechnicianDashboardPage() {

    const navigate =
        useNavigate();

    const firstName =
        localStorage.getItem("firstName") || "Técnico";

    const logout = () => {
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
                w-[320px]
                h-screen
                sticky
                top-0
                bg-[#064E3B]
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
                        <button className="
                            w-full
                            text-left
                            p-4
                            rounded-2xl
                            bg-white/10
                            hover:bg-white/20
                            transition
                        ">
                            Trabajos asignados
                        </button>

                        <button className="
                            w-full
                            text-left
                            p-4
                            rounded-2xl
                            bg-white/10
                            hover:bg-white/20
                            transition
                        ">
                            Aceptados
                        </button>

                        <button className="
                            w-full
                            text-left
                            p-4
                            rounded-2xl
                            bg-white/10
                            hover:bg-white/20
                            transition
                        ">
                            En traslado
                        </button>

                        <button className="
                            w-full
                            text-left
                            p-4
                            rounded-2xl
                            bg-white/10
                            hover:bg-white/20
                            transition
                        ">
                            En atención
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
                        font-semibold
                    "
                >
                    Cerrar sesión
                </button>
            </aside>

            <main className="
                flex-1
                p-10
                overflow-y-auto
            ">
                <section className="
                    mb-10
                ">
                    <p className="
                        text-green-700
                        font-semibold
                        text-sm
                    ">
                        Panel técnico
                    </p>

                    <h2 className="
                        text-5xl
                        font-bold
                        text-[#03152E]
                        mt-2
                    ">
                        Bienvenido, {firstName}
                    </h2>

                    <p className="
                        text-gray-500
                        text-xl
                        mt-4
                    ">
                        Consulta y gestión de trabajos asignados.
                    </p>
                </section>

                <section className="
                    bg-white
                    rounded-3xl
                    border
                    p-8
                    shadow-sm
                ">
                    <div className="
                        flex
                        flex-col
                        lg:flex-row
                        gap-8
                    ">
                        <img
                            src="https://placehold.co/600x400"
                            alt="Reporte asignado"
                            className="
                                w-full
                                lg:w-[300px]
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
                                        text-[#03152E]
                                    ">
                                        Sin trabajos asignados
                                    </h3>

                                    <p className="
                                        text-gray-500
                                        mt-2
                                    ">
                                        Cuando el operador te asigne un reporte,
                                        aparecerá en esta sección.
                                    </p>
                                </div>

                                <span className="
                                    bg-green-100
                                    text-green-700
                                    px-4
                                    py-2
                                    rounded-full
                                    font-semibold
                                ">
                                    Disponible
                                </span>
                            </div>

                            <p className="
                                text-gray-600
                                mt-8
                                leading-relaxed
                            ">
                                Este panel permitirá al técnico aceptar trabajos,
                                cambiar su estado operativo y registrar evidencias
                                de atención en campo.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}