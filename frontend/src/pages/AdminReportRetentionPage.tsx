import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    ReportRetentionService,
} from "../services/reportRetention.service";

export default function AdminReportRetentionPage() {
    const navigate =
        useNavigate();

    const [days, setDays] =
        useState("30");

    const [currentDays, setCurrentDays] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const loadConfiguration =
        async () => {
            try {
                setLoading(true);
                setError("");

                const configuration =
                    await ReportRetentionService.getConfiguration();

                setCurrentDays(
                    configuration.days
                );

                setDays(
                    String(configuration.days)
                );

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo cargar la configuración."
                );

            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadConfiguration();
    }, []);

    const handleSubmit =
        async (
            event: React.FormEvent
        ) => {
            event.preventDefault();

            setMessage("");
            setError("");

            const parsedDays =
                Number(days);

            if (
                Number.isNaN(parsedDays) ||
                !Number.isInteger(parsedDays)
            ) {
                setError(
                    "La cantidad de días debe ser un número entero."
                );

                return;
            }

            if (parsedDays <= 0) {
                setError(
                    "La cantidad de días debe ser mayor a cero."
                );

                return;
            }

            if (parsedDays > 365) {
                setError(
                    "La cantidad de días no puede ser mayor a 365."
                );

                return;
            }

            try {
                setSaving(true);

                const configuration =
                    await ReportRetentionService.updateConfiguration(
                        parsedDays
                    );

                setCurrentDays(
                    configuration.days
                );

                setDays(
                    String(configuration.days)
                );

                setMessage(
                    "Configuración de visibilidad actualizada correctamente."
                );

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo actualizar la configuración."
                );

            } finally {
                setSaving(false);
            }
        };

    const quickOptions =
        [
            7,
            15,
            30,
            60,
            90,
        ];

    return (
        <div className="
            min-h-screen
            bg-[#F5F7FA]
            px-6
            py-8
        ">
            <div className="
                max-w-5xl
                mx-auto
            ">
                <button
                    onClick={() =>
                        navigate("/admin")
                    }
                    className="
                        text-blue-700
                        font-bold
                        mb-6
                        hover:underline
                    "
                >
                    ← Volver al panel administrador
                </button>

                <div className="
                    bg-white
                    rounded-3xl
                    border
                    shadow-sm
                    p-8
                    mb-8
                ">
                    <p className="
                        text-blue-700
                        font-bold
                        mb-2
                    ">
                        Configuración del sistema
                    </p>

                    <h1 className="
                        text-4xl
                        font-bold
                        text-[#03152E]
                    ">
                        Retención visible de reportes
                    </h1>

                    <p className="
                        text-gray-500
                        mt-3
                        max-w-3xl
                    ">
                        Define cuántos días permanecerán visibles los reportes
                        resueltos en mapas y listados operativos. Los reportes
                        no se eliminan físicamente, solo dejan de mostrarse
                        después del periodo configurado.
                    </p>
                </div>

                {message && (
                    <div className="
                        mb-6
                        p-4
                        rounded-2xl
                        bg-green-50
                        border
                        border-green-200
                        text-green-700
                        font-semibold
                    ">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="
                        mb-6
                        p-4
                        rounded-2xl
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        font-semibold
                    ">
                        {error}
                    </div>
                )}

                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-[1fr_360px]
                    gap-8
                ">
                    <section className="
                        bg-white
                        rounded-3xl
                        border
                        shadow-sm
                        p-8
                    ">
                        <h2 className="
                            text-2xl
                            font-bold
                            text-[#03152E]
                            mb-2
                        ">
                            Configurar días visibles
                        </h2>

                        <p className="
                            text-gray-500
                            mb-8
                        ">
                            Valor actual:
                            {" "}
                            <strong>
                                {loading
                                    ? "Cargando..."
                                    : `${currentDays ?? 30} días`}
                            </strong>
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="
                                space-y-6
                            "
                        >
                            <div>
                                <label className="
                                    block
                                    text-sm
                                    font-bold
                                    text-gray-700
                                    mb-2
                                ">
                                    Días de visibilidad
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    max={365}
                                    value={days}
                                    onChange={(event) =>
                                        setDays(event.target.value)
                                    }
                                    className="
                                        w-full
                                        border
                                        rounded-2xl
                                        px-4
                                        py-4
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                    placeholder="30"
                                />

                                <p className="
                                    text-xs
                                    text-gray-500
                                    mt-2
                                ">
                                    Debe ser un número entero entre 1 y 365.
                                </p>
                            </div>

                            <div>
                                <p className="
                                    text-sm
                                    font-bold
                                    text-gray-700
                                    mb-3
                                ">
                                    Opciones rápidas
                                </p>

                                <div className="
                                    flex
                                    flex-wrap
                                    gap-3
                                ">
                                    {quickOptions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() =>
                                                setDays(String(option))
                                            }
                                            className="
                                                px-4
                                                py-2
                                                rounded-xl
                                                border
                                                font-bold
                                                text-gray-700
                                                hover:bg-gray-50
                                            "
                                        >
                                            {option} días
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    loading
                                }
                                className="
                                    w-full
                                    bg-[#03152E]
                                    text-white
                                    rounded-2xl
                                    py-4
                                    font-bold
                                    hover:bg-[#08264f]
                                    disabled:opacity-60
                                "
                            >
                                {saving
                                    ? "Guardando..."
                                    : "Guardar configuración"}
                            </button>
                        </form>
                    </section>

                    <aside className="
                        bg-[#03152E]
                        text-white
                        rounded-3xl
                        p-8
                        h-fit
                    ">
                        <h2 className="
                            text-2xl
                            font-bold
                            mb-4
                        ">
                            ¿Qué cambia?
                        </h2>

                        <p className="
                            text-white/70
                            leading-relaxed
                            mb-6
                        ">
                            Si configuras 30 días, un reporte resuelto seguirá
                            apareciendo durante 30 días desde su fecha de
                            resolución.
                        </p>

                        <div className="
                            bg-white/10
                            rounded-2xl
                            p-5
                        ">
                            <p className="
                                text-sm
                                text-white/60
                            ">
                                Configuración actual
                            </p>

                            <p className="
                                text-4xl
                                font-black
                                mt-2
                            ">
                                {currentDays ?? 30}
                            </p>

                            <p className="
                                text-white/70
                            ">
                                días visibles
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}