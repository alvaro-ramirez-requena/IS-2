import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    TechnicianSkillService,
} from "../services/technicianSkill.service.ts";

import type {
    TechnicianSkill,
} from "../services/technicianSkill.service.ts";

export default function AdminTechnicianSkillsPage() {
    const navigate =
        useNavigate();

    const [skills, setSkills] =
        useState<TechnicianSkill[]>([]);

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const loadSkills =
        async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await TechnicianSkillService.getAll();

                setSkills(data);

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudieron cargar las habilidades técnicas."
                );

            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadSkills();
    }, []);

    const filteredSkills =
        useMemo(() => {
            const normalizedSearch =
                search.trim().toLowerCase();

            if (!normalizedSearch) {
                return skills;
            }

            return skills.filter((skill) =>
                skill.name.toLowerCase().includes(normalizedSearch) ||
                (skill.description || "")
                    .toLowerCase()
                    .includes(normalizedSearch)
            );
        }, [skills, search]);

    const handleCreate =
        async (event: React.FormEvent) => {
            event.preventDefault();

            setMessage("");
            setError("");

            if (!name.trim()) {
                setError(
                    "El nombre de la habilidad es obligatorio."
                );
                return;
            }

            try {
                setSaving(true);

                await TechnicianSkillService.create({
                    name:
                        name.trim(),

                    description:
                        description.trim(),
                });

                setName("");
                setDescription("");

                setMessage(
                    "Habilidad técnica creada correctamente."
                );

                await loadSkills();

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo crear la habilidad técnica."
                );

            } finally {
                setSaving(false);
            }
        };

    const handleToggle =
        async (
            skill: TechnicianSkill
        ) => {
            try {
                setMessage("");
                setError("");

                await TechnicianSkillService.toggle(
                    skill.id,
                    !skill.active
                );

                setMessage(
                    skill.active
                        ? "Habilidad desactivada correctamente."
                        : "Habilidad activada correctamente."
                );

                await loadSkills();

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo cambiar el estado de la habilidad."
                );
            }
        };

    return (
        <div className="
            min-h-screen
            bg-[#F5F7FA]
            px-6
            py-8
        ">
            <div className="
                max-w-6xl
                mx-auto
            ">
                <button
                    onClick={() => navigate("/admin")}
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
                        Habilidades técnicas
                    </h1>

                    <p className="
                        text-gray-500
                        mt-3
                        max-w-3xl
                    ">
                        Administra las habilidades disponibles para que los
                        técnicos las seleccionen durante su postulación.
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
                    lg:grid-cols-[380px_1fr]
                    gap-8
                ">
                    <section className="
                        bg-white
                        rounded-3xl
                        border
                        shadow-sm
                        p-7
                        h-fit
                    ">
                        <h2 className="
                            text-2xl
                            font-bold
                            text-[#03152E]
                            mb-5
                        ">
                            Nueva habilidad
                        </h2>

                        <form
                            onSubmit={handleCreate}
                            className="space-y-5"
                        >
                            <div>
                                <label className="
                                    block
                                    text-sm
                                    font-bold
                                    text-gray-700
                                    mb-2
                                ">
                                    Nombre
                                </label>

                                <input
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    className="
                                        w-full
                                        border
                                        rounded-2xl
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                    placeholder="Ej. Mantenimiento de parques"
                                />
                            </div>

                            <div>
                                <label className="
                                    block
                                    text-sm
                                    font-bold
                                    text-gray-700
                                    mb-2
                                ">
                                    Descripción
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    rows={4}
                                    className="
                                        w-full
                                        border
                                        rounded-2xl
                                        px-4
                                        py-3
                                        outline-none
                                        resize-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                    placeholder="Describe para qué tipo de incidencias aplica."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
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
                                    : "Agregar habilidad"}
                            </button>
                        </form>
                    </section>

                    <section className="
                        bg-white
                        rounded-3xl
                        border
                        shadow-sm
                        p-7
                    ">
                        <div className="
                            flex
                            flex-col
                            md:flex-row
                            md:items-center
                            md:justify-between
                            gap-4
                            mb-6
                        ">
                            <div>
                                <h2 className="
                                    text-2xl
                                    font-bold
                                    text-[#03152E]
                                ">
                                    Habilidades registradas
                                </h2>

                                <p className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                ">
                                    Las habilidades activas aparecerán en la
                                    postulación del técnico.
                                </p>
                            </div>

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                className="
                                    border
                                    rounded-2xl
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    md:w-72
                                "
                                placeholder="Buscar habilidad..."
                            />
                        </div>

                        {loading ? (
                            <div className="
                                text-center
                                py-12
                                text-gray-500
                                font-semibold
                            ">
                                Cargando habilidades...
                            </div>
                        ) : filteredSkills.length === 0 ? (
                            <div className="
                                text-center
                                py-12
                                text-gray-500
                                border
                                rounded-2xl
                                bg-gray-50
                            ">
                                No hay habilidades registradas.
                            </div>
                        ) : (
                            <div className="
                                space-y-4
                            ">
                                {filteredSkills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="
                                            border
                                            rounded-2xl
                                            p-5
                                            flex
                                            flex-col
                                            md:flex-row
                                            md:items-center
                                            md:justify-between
                                            gap-4
                                            hover:bg-gray-50
                                        "
                                    >
                                        <div>
                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                                flex-wrap
                                            ">
                                                <h3 className="
                                                    text-lg
                                                    font-bold
                                                    text-[#03152E]
                                                ">
                                                    {skill.name}
                                                </h3>

                                                <span
                                                    className={`
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-bold
                                                        ${
                                                            skill.active
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-200 text-gray-600"
                                                        }
                                                    `}
                                                >
                                                    {skill.active
                                                        ? "Activa"
                                                        : "Inactiva"}
                                                </span>
                                            </div>

                                            <p className="
                                                text-gray-500
                                                mt-2
                                            ">
                                                {skill.description ||
                                                    "Sin descripción."}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleToggle(skill)
                                            }
                                            className={`
                                                px-5
                                                py-3
                                                rounded-xl
                                                font-bold
                                                ${
                                                    skill.active
                                                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                                                        : "bg-green-50 text-green-700 hover:bg-green-100"
                                                }
                                            `}
                                        >
                                            {skill.active
                                                ? "Desactivar"
                                                : "Activar"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}