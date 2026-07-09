import { useEffect, useState } from "react";

import { ProblemTypeService } from "../../services/problem-type.service";

import { CategoryService } from "../../services/category.service";

import type { ProblemType } from "../../types/problem-type.types";

import type { Category } from "../../types/category.types";

export default function ProblemTypeSection() {

    const [
        problemTypes,
        setProblemTypes,
    ] = useState<ProblemType[]>([]);

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([]);

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
        selectedCategoryId,
        setSelectedCategoryId,
    ] = useState("");

    const [
        editingProblemTypeId,
        setEditingProblemTypeId,
    ] = useState<string | null>(null);

    useEffect(() => {

        loadProblemTypes();

    }, []);

    async function loadProblemTypes() {

        try {

            const data =
                await ProblemTypeService.getAll();

            setProblemTypes(data);

            const categoryData =
                await CategoryService.getAll();

            setCategories(categoryData);

        } catch (error: any) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    }

    async function handleCreateProblemType() {

        if (!name.trim()) {

            alert("Ingrese un nombre");

            return;

        }

        if (!selectedCategoryId) {

            alert(
                "Seleccione una categoría"
            );

            return;

        }

        try {

            if (editingProblemTypeId) {

                await ProblemTypeService.update(

                    editingProblemTypeId,

                    {

                        name,

                        description,

                        categoryId:
                            selectedCategoryId,

                    }

                );

            } else {

                await ProblemTypeService.create({

                    name,

                    description,

                    categoryId:
                        selectedCategoryId,


                });

            }

            await loadProblemTypes();

            setName("");

            setDescription("");

            setShowForm(false);

            setEditingProblemTypeId(null);

        } catch (error: any) {

            alert(error.message);

        }

    }

    async function handleDeleteProblemType(
        id: string
    ) {

        const confirmed =
            confirm(
                "¿Está seguro de eliminar este tipo de problema?"
            );

        if (!confirmed) {

            return;

        }

        try {

            await ProblemTypeService.delete(id);

            await loadProblemTypes();

            setEditingProblemTypeId(null);

            setName("");

            setDescription("");

            setShowForm(false);

        } catch (error: any) {

            alert(error.message);

        }

    }



    if (loading) {

        return (
            <p>Cargando tipos de problema...</p>
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
                Tipos de problema
            </h2>

            <div className="mb-6">

                <button
                    onClick={() => {

                        if (showForm) {

                            setShowForm(false);

                            setEditingProblemTypeId(null);

                            setName("");

                            setDescription("");

                        } else {

                            setEditingProblemTypeId(null);

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
                            : "Nuevo tipo de problema"
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

                        <select
                            value={selectedCategoryId}
                            onChange={(e) =>
                                setSelectedCategoryId(
                                    e.target.value
                                )
                            }
                            className="
        w-full
        border
        rounded-lg
        p-2
    "
                        >

                            <option value="">
                                Seleccione una categoría
                            </option>

                            {

                                categories.map(

                                    (category) => (

                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>

                                    )

                                )

                            }

                        </select>

                        <button
                            onClick={handleCreateProblemType}
                            className="
        bg-green-600
        text-white
        px-4
        py-2
        rounded-lg
    "
                        >
                            {
                                editingProblemTypeId
                                    ? "Actualizar"
                                    : "Guardar"
                            }
                        </button>

                    </div>

                )
            }

            {

                problemTypes.length === 0 ? (

                    <p>
                        No existen tipos de problema.
                    </p>

                ) : (

                    <div className="space-y-4">

                        {

                            problemTypes.map(

                                (problemType) => (

                                    <div
                                        key={problemType.id}
                                        className="
                                            border
                                            rounded-xl
                                            p-4
                                        "
                                    >

                                        <h3
                                            className="font-semibold"
                                        >
                                            {problemType.name}
                                        </h3>

                                        <p>
                                            {
                                                problemType.description ??
                                                "Sin descripción"
                                            }
                                        </p>

                                        <p>

                                            <strong>
                                                Categoría:
                                            </strong>{" "}

                                            {

                                                categories.find(

                                                    (category) =>

                                                        category.id ===
                                                        problemType.categoryId

                                                )?.name ?? "-"

                                            }

                                        </p>

                                        <div className="mt-4 flex gap-3">

                                            <button
                                                onClick={() => {

                                                    setEditingProblemTypeId(
                                                        problemType.id
                                                    );

                                                    setName(
                                                        problemType.name
                                                    );

                                                    setDescription(
                                                        problemType.description ?? ""
                                                    );

                                                    setSelectedCategoryId(
                                                        problemType.categoryId
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
                                                    handleDeleteProblemType(
                                                        problemType.id
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