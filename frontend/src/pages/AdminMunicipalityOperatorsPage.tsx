import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    AdminManagementService,
} from "../services/adminManagement.service";

import type {
    AdminMunicipality,
    AdminOperator,
} from "../services/adminManagement.service";

export default function AdminMunicipalityOperatorsPage() {
    const navigate =
        useNavigate();

    const [municipalities, setMunicipalities] =
        useState<AdminMunicipality[]>([]);

    const [operators, setOperators] =
        useState<AdminOperator[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [savingMunicipality, setSavingMunicipality] =
        useState(false);

    const [savingOperator, setSavingOperator] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [municipalityForm, setMunicipalityForm] =
        useState({
            name: "",
            district: "",
            province: "Lima",
            department: "Lima",
            aliases: "",
        });

    const [operatorForm, setOperatorForm] =
        useState({
            firstName: "",
            lastName: "",
            email: "",
            password: "Operador123!",
            municipalityId: "",
        });

    const loadData =
        async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    municipalitiesData,
                    operatorsData,
                ] =
                    await Promise.all([
                        AdminManagementService.getMunicipalities(),
                        AdminManagementService.getOperators(),
                    ]);

                setMunicipalities(
                    municipalitiesData
                );

                setOperators(
                    operatorsData
                );

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo cargar la información administrativa."
                );

            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadData();
    }, []);

    const operatorsByMunicipality =
        useMemo(() => {
            const grouped:
                Record<string, number> = {};

            for (const operator of operators) {
                const key =
                    operator.municipalityId ||
                    "SIN_MUNICIPALIDAD";

                grouped[key] =
                    (grouped[key] || 0) + 1;
            }

            return grouped;
        }, [operators]);

    const handleCreateMunicipality =
        async (
            event: React.FormEvent
        ) => {
            event.preventDefault();

            setMessage("");
            setError("");

            if (!municipalityForm.name.trim()) {
                setError(
                    "El nombre de la municipalidad es obligatorio."
                );
                return;
            }

            try {
                setSavingMunicipality(true);

                const municipality =
                    await AdminManagementService.createMunicipality({
                        name:
                            municipalityForm.name.trim(),

                        district:
                            municipalityForm.district.trim(),

                        province:
                            municipalityForm.province.trim(),

                        department:
                            municipalityForm.department.trim(),

                        aliases:
                            municipalityForm.aliases.trim(),
                    });

                setMessage(
                    "Municipalidad creada correctamente."
                );

                setMunicipalityForm({
                    name: "",
                    district: "",
                    province: "Lima",
                    department: "Lima",
                    aliases: "",
                });

                setOperatorForm((prev) => ({
                    ...prev,
                    municipalityId:
                        municipality.id,
                }));

                await loadData();

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo crear la municipalidad."
                );

            } finally {
                setSavingMunicipality(false);
            }
        };

    const handleCreateOperator =
        async (
            event: React.FormEvent
        ) => {
            event.preventDefault();

            setMessage("");
            setError("");

            if (
                !operatorForm.firstName.trim() ||
                !operatorForm.lastName.trim() ||
                !operatorForm.email.trim() ||
                !operatorForm.password.trim() ||
                !operatorForm.municipalityId
            ) {
                setError(
                    "Completa todos los campos del operador."
                );
                return;
            }

            try {
                setSavingOperator(true);

                await AdminManagementService.createOperator({
                    firstName:
                        operatorForm.firstName.trim(),

                    lastName:
                        operatorForm.lastName.trim(),

                    email:
                        operatorForm.email.trim(),

                    password:
                        operatorForm.password.trim(),

                    municipalityId:
                        operatorForm.municipalityId,
                });

                setMessage(
                    `Operador creado correctamente. Contraseña temporal: ${operatorForm.password}`
                );

                setOperatorForm({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "Operador123!",
                    municipalityId: "",
                });

                await loadData();

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo crear el operador."
                );

            } finally {
                setSavingOperator(false);
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
                max-w-7xl
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
                        Administración del sistema
                    </p>

                    <h1 className="
                        text-4xl
                        font-bold
                        text-[#03152E]
                    ">
                        Municipalidades y operadores
                    </h1>

                    <p className="
                        text-gray-500
                        mt-3
                        max-w-3xl
                    ">
                        Crea municipalidades y registra operadores asociados a cada una.
                        Cada operador podrá iniciar sesión y gestionar reportes de su municipalidad.
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
                    xl:grid-cols-[420px_420px_1fr]
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
                            Nueva municipalidad
                        </h2>

                        <form
                            onSubmit={handleCreateMunicipality}
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
                                    value={municipalityForm.name}
                                    onChange={(event) =>
                                        setMunicipalityForm((prev) => ({
                                            ...prev,
                                            name:
                                                event.target.value,
                                        }))
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
                                    placeholder="Municipalidad de Chorrillos"
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
                                    Distrito
                                </label>

                                <input
                                    value={municipalityForm.district}
                                    onChange={(event) =>
                                        setMunicipalityForm((prev) => ({
                                            ...prev,
                                            district:
                                                event.target.value,
                                        }))
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
                                    placeholder="Chorrillos"
                                />
                            </div>

                            <div className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-4
                            ">
                                <div>
                                    <label className="
                                        block
                                        text-sm
                                        font-bold
                                        text-gray-700
                                        mb-2
                                    ">
                                        Provincia
                                    </label>

                                    <input
                                        value={municipalityForm.province}
                                        onChange={(event) =>
                                            setMunicipalityForm((prev) => ({
                                                ...prev,
                                                province:
                                                    event.target.value,
                                            }))
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
                                        Departamento
                                    </label>

                                    <input
                                        value={municipalityForm.department}
                                        onChange={(event) =>
                                            setMunicipalityForm((prev) => ({
                                                ...prev,
                                                department:
                                                    event.target.value,
                                            }))
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
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="
                                    block
                                    text-sm
                                    font-bold
                                    text-gray-700
                                    mb-2
                                ">
                                    Alias o zonas relacionadas
                                </label>

                                <input
                                    value={municipalityForm.aliases}
                                    onChange={(event) =>
                                        setMunicipalityForm((prev) => ({
                                            ...prev,
                                            aliases:
                                                event.target.value,
                                        }))
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
                                    placeholder="Covida, Covida 2 Etapa, Pro, Antúnez de Mayolo"
                                />

                                <p className="
                                    text-xs
                                    text-gray-500
                                    mt-2
                                ">
                                    Separe cada alias con comas. Estos nombres ayudan a asociar zonas que Google Maps devuelve en vez del distrito oficial.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={savingMunicipality}
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
                                {
                                    savingMunicipality
                                        ? "Guardando..."
                                        : "Crear municipalidad"
                                }
                            </button>
                        </form>
                    </section>

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
                            Nuevo operador
                        </h2>

                        <form
                            onSubmit={handleCreateOperator}
                            className="space-y-5"
                        >
                            <div className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-4
                            ">
                                <div>
                                    <label className="
                                        block
                                        text-sm
                                        font-bold
                                        text-gray-700
                                        mb-2
                                    ">
                                        Nombres
                                    </label>

                                    <input
                                        value={operatorForm.firstName}
                                        onChange={(event) =>
                                            setOperatorForm((prev) => ({
                                                ...prev,
                                                firstName:
                                                    event.target.value,
                                            }))
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
                                        placeholder="Operador"
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
                                        Apellidos
                                    </label>

                                    <input
                                        value={operatorForm.lastName}
                                        onChange={(event) =>
                                            setOperatorForm((prev) => ({
                                                ...prev,
                                                lastName:
                                                    event.target.value,
                                            }))
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
                                        placeholder="Chorrillos"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="
                                    block
                                    text-sm
                                    font-bold
                                    text-gray-700
                                    mb-2
                                ">
                                    Correo
                                </label>

                                <input
                                    type="email"
                                    value={operatorForm.email}
                                    onChange={(event) =>
                                        setOperatorForm((prev) => ({
                                            ...prev,
                                            email:
                                                event.target.value,
                                        }))
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
                                    placeholder="operador.chorrillos@reportaya.pe"
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
                                    Contraseña temporal
                                </label>

                                <input
                                    value={operatorForm.password}
                                    onChange={(event) =>
                                        setOperatorForm((prev) => ({
                                            ...prev,
                                            password:
                                                event.target.value,
                                        }))
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
                                    placeholder="Operador123!"
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
                                    Municipalidad asignada
                                </label>

                                <select
                                    value={operatorForm.municipalityId}
                                    onChange={(event) =>
                                        setOperatorForm((prev) => ({
                                            ...prev,
                                            municipalityId:
                                                event.target.value,
                                        }))
                                    }
                                    className="
                                        w-full
                                        border
                                        rounded-2xl
                                        px-4
                                        py-3
                                        bg-white
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                >
                                    <option value="">
                                        Selecciona una municipalidad
                                    </option>

                                    {municipalities.map((municipality) => (
                                        <option
                                            key={municipality.id}
                                            value={municipality.id}
                                        >
                                            {municipality.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    savingOperator ||
                                    municipalities.length === 0
                                }
                                className="
                                    w-full
                                    bg-blue-700
                                    text-white
                                    rounded-2xl
                                    py-4
                                    font-bold
                                    hover:bg-blue-800
                                    disabled:opacity-60
                                "
                            >
                                {
                                    savingOperator
                                        ? "Creando..."
                                        : "Crear operador"
                                }
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
                            items-start
                            justify-between
                            gap-4
                            mb-6
                        ">
                            <div>
                                <h2 className="
                                    text-2xl
                                    font-bold
                                    text-[#03152E]
                                ">
                                    Municipalidades registradas
                                </h2>

                                <p className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                ">
                                    Resumen de operadores por municipalidad.
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="
                                text-center
                                py-12
                                text-gray-500
                                font-semibold
                            ">
                                Cargando información...
                            </div>
                        ) : municipalities.length === 0 ? (
                            <div className="
                                text-center
                                py-12
                                text-gray-500
                                border
                                rounded-2xl
                                bg-gray-50
                            ">
                                No hay municipalidades registradas.
                            </div>
                        ) : (
                            <div className="
                                space-y-4
                                mb-8
                            ">
                                {municipalities.map((municipality) => (
                                    <div
                                        key={municipality.id}
                                        className="
                                            border
                                            rounded-2xl
                                            p-5
                                            hover:bg-gray-50
                                        "
                                    >
                                        <div className="
                                            flex
                                            justify-between
                                            gap-4
                                            flex-wrap
                                        ">
                                            <div>
                                                <h3 className="
                                                    font-bold
                                                    text-[#03152E]
                                                    text-lg
                                                ">
                                                    {municipality.name}
                                                </h3>

                                                <p className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                ">
                                                    {municipality.district || "Sin distrito"}
                                                    {" · "}
                                                    {municipality.province || "Sin provincia"}
                                                    {" · "}
                                                    {municipality.department || "Sin departamento"}
                                                    {municipality.aliases && municipality.aliases.length > 0 && (
                                                        <p className="
                                                            text-xs
                                                            text-gray-500
                                                            mt-2
                                                        ">
                                                            Alias: {municipality.aliases.join(", ")}
                                                        </p>
                                                    )}
                                                </p>
                                            </div>

                                            <span className="
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-blue-50
                                                text-blue-700
                                                text-xs
                                                font-bold
                                                h-fit
                                            ">
                                                {
                                                    operatorsByMunicipality[
                                                        municipality.id
                                                    ] || 0
                                                } operadores
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <h2 className="
                            text-2xl
                            font-bold
                            text-[#03152E]
                            mb-5
                        ">
                            Operadores registrados
                        </h2>

                        {operators.length === 0 ? (
                            <div className="
                                text-center
                                py-10
                                text-gray-500
                                border
                                rounded-2xl
                                bg-gray-50
                            ">
                                No hay operadores registrados.
                            </div>
                        ) : (
                            <div className="
                                space-y-4
                            ">
                                {operators.map((operator) => (
                                    <div
                                        key={operator.id}
                                        className="
                                            border
                                            rounded-2xl
                                            p-5
                                            hover:bg-gray-50
                                        "
                                    >
                                        <h3 className="
                                            font-bold
                                            text-[#03152E]
                                        ">
                                            {operator.firstName} {operator.lastName}
                                        </h3>

                                        <p className="
                                            text-sm
                                            text-gray-600
                                            mt-1
                                        ">
                                            {operator.email}
                                        </p>

                                        <p className="
                                            text-sm
                                            text-blue-700
                                            font-semibold
                                            mt-2
                                        ">
                                            {operator.municipality?.name ||
                                                "Sin municipalidad asignada"}
                                        </p>
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