import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    ChangeEvent,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    FieldWorkService,
} from "../services/fieldwork.service";

import type {
    FieldWork,
    EvidencePhase,
} from "../services/fieldwork.service";

import {
    statusLabels,
} from "../utils/reportLabels";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

type Report = {
    id: string;
    title: string;
    problemType: string;
    description: string;
    status: string;
    address?: string;
    priority?: string;
    latitude?: number;
    longitude?: number;
    evidences?: {
        imageUrl: string;
    }[];
    municipality?: {
        id: string;
        name: string;
    } | null;
};

function formatDateTime(
    value?: string | null
) {
    if (!value) {
        return "No registrado";
    }

    return new Date(value)
        .toLocaleString();
}

function fileToBase64(
    file: File
) {
    return new Promise<string>(
        (resolve, reject) => {
            const reader =
                new FileReader();

            reader.onload =
                () => {
                    const image =
                        new Image();

                    image.onload =
                        () => {
                            const maxWidth =
                                1000;

                            const scale =
                                Math.min(
                                    1,
                                    maxWidth / image.width
                                );

                            const canvas =
                                document.createElement("canvas");

                            canvas.width =
                                image.width * scale;

                            canvas.height =
                                image.height * scale;

                            const context =
                                canvas.getContext("2d");

                            if (!context) {
                                reject(
                                    new Error(
                                        "No se pudo procesar la imagen."
                                    )
                                );
                                return;
                            }

                            context.drawImage(
                                image,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );

                            const compressedBase64 =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.75
                                );

                            resolve(compressedBase64);
                        };

                    image.onerror =
                        () => reject(
                            new Error(
                                "No se pudo cargar la imagen."
                            )
                        );

                    image.src =
                        String(reader.result);
                };

            reader.onerror =
                () => reject(
                    new Error(
                        "No se pudo leer la imagen."
                    )
                );

            reader.readAsDataURL(file);
        }
    );
}
export default function TechnicianFieldWorkPage() {
    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const [report, setReport] =
        useState<Report | null>(null);

    const [fieldWork, setFieldWork] =
        useState<FieldWork | null>(null);

    const [notes, setNotes] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [online, setOnline] =
        useState(navigator.onLine);

    const technicianId =
        localStorage.getItem("userId") || "";

    const localDraftKey =
        `fieldwork-draft-${id}`;

    useEffect(() => {
        const handleOnline =
            () => setOnline(true);

        const handleOffline =
            () => setOnline(false);

        window.addEventListener(
            "online",
            handleOnline
        );

        window.addEventListener(
            "offline",
            handleOffline
        );

        return () => {
            window.removeEventListener(
                "online",
                handleOnline
            );

            window.removeEventListener(
                "offline",
                handleOffline
            );
        };
    }, []);

    const beforeEvidences =
        useMemo(() => {
            return fieldWork?.evidences
                ?.filter((evidence) =>
                    evidence.phase === "BEFORE"
                ) || [];
        }, [fieldWork]);

    const afterEvidences =
        useMemo(() => {
            return fieldWork?.evidences
                ?.filter((evidence) =>
                    evidence.phase === "AFTER"
                ) || [];
        }, [fieldWork]);

    const loadData =
        async () => {
            if (!id) {
                return;
            }

            try {
                setLoading(true);
                setError("");

                const reportResponse =
                    await fetch(
                        `${API_URL}/api/reports/${id}`
                    );

                const reportData =
                    await reportResponse.json();

                if (!reportResponse.ok) {
                    throw new Error(
                        reportData?.message ||
                        "No se pudo cargar el reporte."
                    );
                }

                setReport(reportData);

                const currentFieldWork =
                    await FieldWorkService
                        .getByReport(id);

                setFieldWork(currentFieldWork);

                if (currentFieldWork?.notes) {
                    setNotes(
                        currentFieldWork.notes
                    );
                } else {
                    const localDraft =
                        localStorage.getItem(
                            localDraftKey
                        );

                    if (localDraft) {
                        setNotes(localDraft);
                    }
                }

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo cargar la trazabilidad."
                );

            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleStart =
        async () => {
            if (!id || !technicianId) {
                setError(
                    "No se encontró el técnico en sesión."
                );
                return;
            }

            try {
                setSaving(true);
                setError("");
                setSuccessMessage("");

                const result =
                    await FieldWorkService.start(
                        id,
                        technicianId
                    );

                setFieldWork(result);

                setSuccessMessage(
                    "Trazabilidad iniciada correctamente."
                );

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo iniciar la trazabilidad."
                );

            } finally {
                setSaving(false);
            }
        };

    const handleArrival =
        async () => {
            if (!id || !technicianId) {
                setError(
                    "No se encontró el técnico en sesión."
                );
                return;
            }

            if (!navigator.geolocation) {
                setError(
                    "El navegador no permite obtener ubicación."
                );
                return;
            }

            setSaving(true);
            setError("");
            setSuccessMessage("");

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const result =
                            await FieldWorkService
                                .registerArrival({
                                    reportId: id,
                                    technicianId,
                                    arrivalLat:
                                        position.coords.latitude,
                                    arrivalLng:
                                        position.coords.longitude,
                                });

                        setFieldWork(result);

                        setSuccessMessage(
                            "Llegada registrada correctamente."
                        );

                    } catch (error: any) {
                        setError(
                            error.message ||
                            "No se pudo registrar la llegada."
                        );

                    } finally {
                        setSaving(false);
                    }
                },

                () => {
                    setSaving(false);
                    setError(
                        "No se pudo obtener tu ubicación actual."
                    );
                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                }
            );
        };

    const handleSaveNotes =
        async () => {
            if (!id) {
                return;
            }

            if (!notes.trim()) {
                setError(
                    "Las notas de trabajo son obligatorias."
                );
                return;
            }

            if (!online) {
                localStorage.setItem(
                    localDraftKey,
                    notes
                );

                setSuccessMessage(
                    "Sin conexión: las notas quedaron guardadas localmente para sincronizar luego."
                );

                return;
            }

            try {
                setSaving(true);
                setError("");
                setSuccessMessage("");

                const result =
                    await FieldWorkService
                        .saveNotes(
                            id,
                            notes
                        );

                setFieldWork(result);

                localStorage.removeItem(
                    localDraftKey
                );

                setSuccessMessage(
                    "Notas guardadas correctamente."
                );

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudieron guardar las notas."
                );

            } finally {
                setSaving(false);
            }
        };

    const handleEvidenceUpload =
        async (
            event: ChangeEvent<HTMLInputElement>,
            phase: EvidencePhase
        ) => {
            if (!id || !technicianId) {
                setError(
                    "No se encontró el técnico en sesión."
                );
                event.target.value = "";
                return;
            }

            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }

            try {
                setSaving(true);
                setError("");
                setSuccessMessage("");

                const imageUrl =
                    await fileToBase64(file);

                const result =
                    await FieldWorkService
                        .addEvidence({
                            reportId: id,
                            technicianId,
                            imageUrl,
                            phase,
                        });

                setFieldWork(result);

                setSuccessMessage(
                    phase === "BEFORE"
                        ? "Foto antes registrada correctamente."
                        : "Foto después registrada correctamente."
                );

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo registrar la evidencia."
                );

            } finally {
                setSaving(false);
                event.target.value = "";
            }
        };

    const handleDeleteEvidence =
        async (
            evidenceId: string
        ) => {
            const confirmed =
                window.confirm(
                    "¿Deseas quitar esta foto?"
                );

            if (!confirmed) {
                return;
            }

            try {
                setSaving(true);
                setError("");
                setSuccessMessage("");

                const result =
                    await FieldWorkService
                        .deleteEvidence(evidenceId);

                setFieldWork(result);

                setSuccessMessage(
                    "Evidencia eliminada correctamente."
                );

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo eliminar la evidencia."
                );

            } finally {
                setSaving(false);
            }
        };

    const handleSyncLocalNotes =
        async () => {
            if (!id) {
                return;
            }

            const localDraft =
                localStorage.getItem(
                    localDraftKey
                );

            if (!localDraft) {
                setError(
                    "No hay notas locales pendientes."
                );
                return;
            }

            if (!online) {
                setError(
                    "Necesitas conexión para sincronizar las notas locales."
                );
                return;
            }

            try {
                setSaving(true);
                setError("");
                setSuccessMessage("");

                const result =
                    await FieldWorkService
                        .saveNotes(
                            id,
                            localDraft
                        );

                setFieldWork(result);
                setNotes(localDraft);

                localStorage.removeItem(
                    localDraftKey
                );

                setSuccessMessage(
                    "Notas locales sincronizadas correctamente."
                );

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudieron sincronizar las notas locales."
                );

            } finally {
                setSaving(false);
            }
        };

    const handleClose =
        async () => {
            if (!id) {
                return;
            }

            const confirmed =
                window.confirm(
                    "¿Deseas cerrar el registro de trabajo de campo? Luego deberás registrar el resultado técnico final."
                );

            if (!confirmed) {
                return;
            }

            try {
                setSaving(true);
                setError("");
                setSuccessMessage("");

                await FieldWorkService
                    .close(id);

                setSuccessMessage(
                    "Trabajo de campo registrado correctamente. Ahora registra el resultado técnico final."
                );

                setTimeout(() => {
                    navigate(
                        `/technician/reports/${id}/closure`
                    );
                }, 1000);

            } catch (error: any) {
                setError(
                    error.message ||
                    "No se pudo cerrar el trabajo de campo."
                );

            } finally {
                setSaving(false);
            }
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
            p-6
            lg:p-8
        ">
            <div className="
                max-w-7xl
                mx-auto
                space-y-8
            ">
                <button
                    onClick={() =>
                        navigate(
                            `/technician/reports/${report.id}`
                        )
                    }
                    className="
                        text-blue-700
                        font-semibold
                        hover:underline
                    "
                >
                    ← Volver al detalle
                </button>

                <section className="
                    bg-white
                    border
                    rounded-3xl
                    shadow-sm
                    p-6
                    lg:p-8
                    space-y-8
                ">
                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1fr_360px]
                        gap-8
                        items-start
                    ">
                        <div>
                            <p className="
                                text-green-700
                                font-semibold
                            ">
                                US18 - Evidencia y trazabilidad
                            </p>

                            <h1 className="
                                text-4xl
                                lg:text-5xl
                                font-bold
                                text-[#03152E]
                                mt-2
                                leading-tight
                            ">
                                Trabajo de campo
                            </h1>

                            <p className="
                                text-gray-500
                                mt-4
                                max-w-3xl
                                text-lg
                                leading-relaxed
                            ">
                                Registra la hora de llegada, notas,
                                evidencias antes y después, validación
                                de ubicación y cierre de atención técnica.
                            </p>
                        </div>

                        <div className="
                            bg-blue-50
                            border
                            border-blue-100
                            rounded-2xl
                            p-5
                            space-y-3
                        ">
                            <h2 className="
                                font-bold
                                text-[#03152E]
                                text-lg
                            ">
                                Reporte trabajado
                            </h2>

                            <p>
                                <strong>Título:</strong>{" "}
                                {report.title}
                            </p>

                            <p>
                                <strong>Tipo:</strong>{" "}
                                {report.problemType}
                            </p>

                            <p>
                                <strong>Estado:</strong>{" "}
                                {
                                    statusLabels[report.status] ||
                                    report.status
                                }
                            </p>

                            <p>
                                <strong>Prioridad:</strong>{" "}
                                {report.priority || "No definida"}
                            </p>

                            <p>
                                <strong>Municipalidad:</strong>{" "}
                                {
                                    report.municipality?.name ||
                                    "No definida"
                                }
                            </p>

                            <p>
                                <strong>Conexión:</strong>{" "}
                                <span className={
                                    online
                                        ? "text-green-700 font-bold"
                                        : "text-red-700 font-bold"
                                }>
                                    {
                                        online
                                            ? "En línea"
                                            : "Sin conexión"
                                    }
                                </span>
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="
                            bg-red-50
                            border
                            border-red-200
                            text-red-700
                            rounded-2xl
                            p-4
                            font-semibold
                        ">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="
                            bg-green-50
                            border
                            border-green-200
                            text-green-700
                            rounded-2xl
                            p-4
                            font-semibold
                        ">
                            {successMessage}
                        </div>
                    )}

                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[340px_1fr]
                        gap-8
                    ">
                        <aside className="
                            space-y-6
                        ">
                            <div className="
                                bg-gray-50
                                border
                                rounded-2xl
                                p-5
                            ">
                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-[#03152E]
                                    mb-3
                                ">
                                    Resumen del reporte
                                </h2>

                                <p className="
                                    text-gray-600
                                    leading-relaxed
                                ">
                                    {report.description}
                                </p>

                                {report.address && (
                                    <p className="
                                        text-sm
                                        text-gray-500
                                        mt-4
                                    ">
                                        <strong>Dirección:</strong>{" "}
                                        {report.address}
                                    </p>
                                )}
                            </div>

                            <div className="
                                bg-gray-50
                                border
                                rounded-2xl
                                p-5
                            ">
                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-[#03152E]
                                    mb-3
                                ">
                                    Evidencia inicial
                                </h2>

                                <img
                                    src={
                                        report.evidences?.[0]?.imageUrl ||
                                        "https://placehold.co/600x400?text=Sin+evidencia"
                                    }
                                    alt={report.problemType}
                                    className="
                                        w-full
                                        h-[220px]
                                        object-cover
                                        rounded-2xl
                                        border
                                    "
                                />
                            </div>
                        </aside>

                        <main className="
                            space-y-8
                        ">
                            <div className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-6
                            ">
                                <div className="
                                    bg-gray-50
                                    border
                                    rounded-2xl
                                    p-6
                                    space-y-4
                                ">
                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-[#03152E]
                                    ">
                                        1. Inicio de trazabilidad
                                    </h2>

                                    <p className="
                                        text-gray-600
                                    ">
                                        Crea el registro de trabajo de campo para este reporte.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleStart}
                                        disabled={
                                            saving ||
                                            !!fieldWork
                                        }
                                        className="
                                            w-full
                                            bg-blue-700
                                            text-white
                                            font-bold
                                            rounded-2xl
                                            py-4
                                            hover:bg-blue-800
                                            transition
                                            disabled:bg-gray-300
                                        "
                                    >
                                        {
                                            fieldWork
                                                ? "Trazabilidad iniciada"
                                                : "Iniciar trazabilidad"
                                        }
                                    </button>
                                </div>

                                <div className="
                                    bg-gray-50
                                    border
                                    rounded-2xl
                                    p-6
                                    space-y-4
                                ">
                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-[#03152E]
                                    ">
                                        2. Llegada al punto
                                    </h2>

                                    <p>
                                        <strong>Hora de llegada:</strong>{" "}
                                        {
                                            formatDateTime(
                                                fieldWork?.arrivedAt
                                            )
                                        }
                                    </p>

                                    <p>
                                        <strong>Distancia:</strong>{" "}
                                        {
                                            fieldWork?.distanceMeters !==
                                            null &&
                                            fieldWork?.distanceMeters !==
                                            undefined
                                                ? `${fieldWork.distanceMeters} m`
                                                : "No calculada"
                                        }
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleArrival}
                                        disabled={
                                            saving ||
                                            !fieldWork ||
                                            !!fieldWork.arrivedAt
                                        }
                                        className="
                                            w-full
                                            bg-green-700
                                            text-white
                                            font-bold
                                            rounded-2xl
                                            py-4
                                            hover:bg-green-800
                                            transition
                                            disabled:bg-gray-300
                                        "
                                    >
                                        {
                                            fieldWork?.arrivedAt
                                                ? "Llegada registrada"
                                                : "Registrar llegada con ubicación"
                                        }
                                    </button>
                                </div>
                            </div>

                            <div className="
                                bg-gray-50
                                border
                                rounded-2xl
                                p-6
                                space-y-4
                            ">
                                <h2 className="
                                    text-2xl
                                    font-bold
                                    text-[#03152E]
                                ">
                                    3. Notas de trabajo
                                </h2>

                                <textarea
                                    value={notes}
                                    onChange={(event) => {
                                        setNotes(
                                            event.target.value
                                        );

                                        localStorage.setItem(
                                            localDraftKey,
                                            event.target.value
                                        );
                                    }}
                                    placeholder="Describe observaciones, acciones realizadas, incidencias encontradas o coordinaciones hechas en campo."
                                    className="
                                        w-full
                                        border
                                        rounded-2xl
                                        p-4
                                        bg-white
                                        min-h-[150px]
                                        resize-none
                                    "
                                />

                                <div className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    gap-3
                                ">
                                    <button
                                        type="button"
                                        onClick={handleSaveNotes}
                                        disabled={
                                            saving ||
                                            !fieldWork
                                        }
                                        className="
                                            flex-1
                                            bg-blue-700
                                            text-white
                                            font-bold
                                            rounded-2xl
                                            py-4
                                            hover:bg-blue-800
                                            transition
                                            disabled:bg-gray-300
                                        "
                                    >
                                        Guardar notas
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSyncLocalNotes}
                                        disabled={
                                            saving ||
                                            online === false
                                        }
                                        className="
                                            flex-1
                                            bg-white
                                            border
                                            text-blue-700
                                            font-bold
                                            rounded-2xl
                                            py-4
                                            hover:bg-blue-50
                                            transition
                                            disabled:bg-gray-100
                                            disabled:text-gray-400
                                        "
                                    >
                                        Sincronizar notas offline
                                    </button>
                                </div>
                            </div>

                            <div className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-6
                            ">
                                <div className="
                                    bg-gray-50
                                    border
                                    rounded-2xl
                                    p-6
                                    space-y-4
                                ">
                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-[#03152E]
                                    ">
                                        4. Fotos antes
                                    </h2>

                                    <p className="
                                        text-sm
                                        text-gray-500
                                    ">
                                        Adjunta evidencia visual del estado inicial del problema antes de la intervención.
                                    </p>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={!fieldWork || saving}
                                        onChange={(event) =>
                                            handleEvidenceUpload(
                                                event,
                                                "BEFORE"
                                            )
                                        }
                                        className="
                                            w-full
                                            bg-white
                                            border
                                            rounded-xl
                                            p-3
                                        "
                                    />

                                    {beforeEvidences.length === 0 ? (
                                        <div className="
                                            bg-white
                                            border
                                            border-dashed
                                            rounded-xl
                                            p-4
                                            text-gray-500
                                            text-sm
                                        ">
                                            Todavía no hay fotos antes registradas.
                                        </div>
                                    ) : (
                                        <div className="
                                            grid
                                            grid-cols-2
                                            gap-3
                                        ">
                                            {beforeEvidences.map(
                                                (evidence) => (
                                                    <div
                                                        key={evidence.id}
                                                        className="
                                                            relative
                                                            group
                                                        "
                                                    >
                                                        <img
                                                            src={evidence.imageUrl}
                                                            alt="Antes"
                                                            className="
                                                                w-full
                                                                h-[120px]
                                                                object-cover
                                                                rounded-xl
                                                                border
                                                            "
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteEvidence(
                                                                    evidence.id
                                                                )
                                                            }
                                                            disabled={saving}
                                                            className="
                                                                absolute
                                                                top-2
                                                                right-2
                                                                w-8
                                                                h-8
                                                                rounded-full
                                                                bg-red-600
                                                                text-white
                                                                font-bold
                                                                shadow
                                                                hover:bg-red-700
                                                                transition
                                                            "
                                                            title="Quitar foto"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="
                                    bg-gray-50
                                    border
                                    rounded-2xl
                                    p-6
                                    space-y-4
                                ">
                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-[#03152E]
                                    ">
                                        5. Fotos después
                                    </h2>

                                    <p className="
                                        text-sm
                                        text-gray-500
                                    ">
                                        Adjunta evidencia visual del estado final luego de la intervención.
                                    </p>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={!fieldWork || saving}
                                        onChange={(event) =>
                                            handleEvidenceUpload(
                                                event,
                                                "AFTER"
                                            )
                                        }
                                        className="
                                            w-full
                                            bg-white
                                            border
                                            rounded-xl
                                            p-3
                                        "
                                    />

                                    {afterEvidences.length === 0 ? (
                                        <div className="
                                            bg-white
                                            border
                                            border-dashed
                                            rounded-xl
                                            p-4
                                            text-gray-500
                                            text-sm
                                        ">
                                            Todavía no hay fotos después registradas.
                                        </div>
                                    ) : (
                                        <div className="
                                            grid
                                            grid-cols-2
                                            gap-3
                                        ">
                                            {afterEvidences.map(
                                                (evidence) => (
                                                    <div
                                                        key={evidence.id}
                                                        className="
                                                            relative
                                                            group
                                                        "
                                                    >
                                                        <img
                                                            src={evidence.imageUrl}
                                                            alt="Después"
                                                            className="
                                                                w-full
                                                                h-[120px]
                                                                object-cover
                                                                rounded-xl
                                                                border
                                                            "
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteEvidence(
                                                                    evidence.id
                                                                )
                                                            }
                                                            disabled={saving}
                                                            className="
                                                                absolute
                                                                top-2
                                                                right-2
                                                                w-8
                                                                h-8
                                                                rounded-full
                                                                bg-red-600
                                                                text-white
                                                                font-bold
                                                                shadow
                                                                hover:bg-red-700
                                                                transition
                                                            "
                                                            title="Quitar foto"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="
                                bg-gray-50
                                border
                                rounded-2xl
                                p-6
                                space-y-4
                            ">
                                <h2 className="
                                    text-2xl
                                    font-bold
                                    text-[#03152E]
                                ">
                                    6. Cierre de trabajo
                                </h2>

                                <p>
                                    <strong>Hora de cierre:</strong>{" "}
                                    {
                                        formatDateTime(
                                            fieldWork?.closedAt
                                        )
                                    }
                                </p>

                                <p className="
                                    text-gray-600
                                ">
                                    Para cerrar el trabajo se requiere registrar llegada, notas, al menos una foto antes y una foto después.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={
                                        saving ||
                                        !fieldWork ||
                                        !!fieldWork.closedAt
                                    }
                                    className="
                                        w-full
                                        bg-green-700
                                        text-white
                                        font-bold
                                        text-lg
                                        rounded-2xl
                                        py-4
                                        hover:bg-green-800
                                        transition
                                        disabled:bg-gray-300
                                    "
                                >
                                    {
                                        fieldWork?.closedAt
                                            ? "Trabajo cerrado"
                                            : "Cerrar trabajo de campo"
                                    }
                                </button>
                            </div>
                        </main>
                    </div>
                </section>
            </div>
        </div>
    );
}