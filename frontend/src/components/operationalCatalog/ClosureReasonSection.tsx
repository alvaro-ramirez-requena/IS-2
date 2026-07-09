import { useEffect, useState } from "react";

import { ClosureReasonService } from "../../services/closure-reason.service";

import type { ClosureReason } from "../../types/closure-reason.types";

export default function ClosureReasonSection() {

    const [
        closureReasons,
        setClosureReasons,
    ] = useState<ClosureReason[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        showForm,
        setShowForm,
    ] = useState(false);

    const [
        name,
        setName,
    ] = useState("");

    const [
        description,
        setDescription,
    ] = useState("");

    const [
        editingClosureReasonId,
        setEditingClosureReasonId,
    ] = useState<string | null>(null);

    useEffect(() => {

        loadClosureReasons();

    }, []);

    async function loadClosureReasons() {

        try {

            const data =
                await ClosureReasonService.getAll();

            setClosureReasons(data);

        } catch (error: any) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    }

    async function handleCreateClosureReason() {

        if (!name.trim()) {

            alert("Ingrese un nombre");

            return;

        }

        try {

            if (editingClosureReasonId) {

                await ClosureReasonService.update(

                    editingClosureReasonId,

                    {

                        name,

                        description,

                    }

                );

            } else {

                await ClosureReasonService.create({

                    name,

                    description,

                });

            }

            await loadClosureReasons();

            setName("");

            setDescription("");

            setShowForm(false);

            setEditingClosureReasonId(null);

        } catch (error: any) {

            alert(error.message);

        }

    }

    async function handleDeleteClosureReason(
        id: string
    ) {

        const confirmed =
            confirm(
                "¿Está seguro de eliminar este motivo de cierre?"
            );

        if (!confirmed) {

            return;

        }

        try {

            await ClosureReasonService.delete(id);

            await loadClosureReasons();

            setEditingClosureReasonId(null);

            setName("");

            setDescription("");

            setShowForm(false);

        } catch (error: any) {

            alert(error.message);

        }

    }



    if (loading) {

        return (
            <p>Cargando motivos de cierre...</p>
        );

    }

    if (error) {

        return (
            <p className="text-red-600">
                {error}
            </p>
        );

    }

    return (

        <div>

            <h2 className="text-2xl font-bold mb-6">
                Motivos de cierre
            </h2>

            <div className="mb-6">

                <button
                    onClick={() => {

                        if (showForm) {

                            setShowForm(false);

                            setEditingClosureReasonId(null);

                            setName("");

                            setDescription("");

                        } else {

                            setEditingClosureReasonId(null);

                            setName("");

                            setDescription("");

                            setShowForm(true);

                        }

                    }}
                    className="
        bg-blue-600
        text-white
        px-4
        py-2
        rounded-lg
    "
                >
                    {
                        showForm
                            ? "Cancelar"
                            : "Nuevo motivo de cierre"
                    }
                </button>

            </div>

            {
                showForm && (

                    <div
                        className="
                border
                rounded-xl
                p-4
                mb-6
                space-y-4
            "
                    >

                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="
                    w-full
                    border
                    rounded-lg
                    p-2
                "
                        />

                        <textarea
                            placeholder="Descripción"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            className="
                    w-full
                    border
                    rounded-lg
                    p-2
                "
                        />

                        <button
                            onClick={handleCreateClosureReason}
                            className="
        bg-green-600
        text-white
        px-4
        py-2
        rounded-lg
    "
                        >
                            {
                                editingClosureReasonId
                                    ? "Actualizar"
                                    : "Guardar"
                            }
                        </button>

                    </div>

                )
            }

            {

                closureReasons.length === 0 ? (

                    <p>
                        No existen motivos de cierre.
                    </p>

                ) : (

                    <div className="space-y-4">

                        {

                            closureReasons.map(

                                (closureReason) => (

                                    <div
                                        key={closureReason.id}
                                        className="
                                            border
                                            rounded-xl
                                            p-4
                                        "
                                    >

                                        <h3
                                            className="font-semibold"
                                        >
                                            {closureReason.name}
                                        </h3>

                                        <p>
                                            {
                                                closureReason.description ??
                                                "Sin descripción"
                                            }
                                        </p>

                                        <div className="mt-4 flex gap-3">

                                            <button
                                                onClick={() => {

                                                    setEditingClosureReasonId(
                                                        closureReason.id
                                                    );

                                                    setName(
                                                        closureReason.name
                                                    );

                                                    setDescription(
                                                        closureReason.description ?? ""
                                                    );

                                                    setShowForm(true);

                                                }}
                                                className="
            bg-yellow-500
            text-white
            px-4
            py-2
            rounded-lg
        "
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDeleteClosureReason(
                                                        closureReason.id
                                                    )
                                                }
                                                className="
            bg-red-600
            text-white
            px-4
            py-2
            rounded-lg
        "
                                            >
                                                Eliminar
                                            </button>

                                        </div>

                                    </div>

                                )

                            )

                        }

                    </div>

                )

            }

        </div>

    );

}