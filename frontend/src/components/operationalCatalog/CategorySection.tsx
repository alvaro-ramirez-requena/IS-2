import { useEffect, useState } from "react";

import { CategoryService } from "../../services/category.service";

import type { Category } from "../../types/category.types";

export default function CategorySection() {

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
        editingCategoryId,
        setEditingCategoryId,
    ] = useState<string | null>(null);

    useEffect(() => {

        loadCategories();

    }, []);

    async function loadCategories() {

        try {

            const data =
                await CategoryService.getAll();

            setCategories(data);

        } catch (error: any) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    }

    async function handleCreateCategory() {

        if (!name.trim()) {

            alert("Ingrese un nombre");

            return;

        }

        try {

            if (editingCategoryId) {

                await CategoryService.update(

                    editingCategoryId,

                    {

                        name,

                        description,

                    }

                );

            } else {

                await CategoryService.create({

                    name,

                    description,

                });

            }

            await loadCategories();

            setName("");

            setDescription("");

            setShowForm(false);

            setEditingCategoryId(null);

        } catch (error: any) {

            alert(error.message);

        }

    }

    async function handleDeleteCategory(
        id: string
    ) {

        const confirmed =
            confirm(
                "¿Está seguro de eliminar esta categoría?"
            );

        if (!confirmed) {

            return;

        }

        try {

            await CategoryService.delete(id);

            await loadCategories();

            setEditingCategoryId(null);

            setName("");

            setDescription("");

            setShowForm(false);

        } catch (error: any) {

            alert(error.message);

        }

    }



    if (loading) {

        return (
            <p>Cargando categorías...</p>
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
                Categorías
            </h2>

            <div className="mb-6">

                <button
                    onClick={() => {

                        if (showForm) {

                            setShowForm(false);

                            setEditingCategoryId(null);

                            setName("");

                            setDescription("");

                        } else {

                            setEditingCategoryId(null);

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
                            : "Nueva categoría"
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
                            onClick={handleCreateCategory}
                            className="
        bg-green-600
        text-white
        px-4
        py-2
        rounded-lg
    "
                        >
                            {
                                editingCategoryId
                                    ? "Actualizar"
                                    : "Guardar"
                            }
                        </button>

                    </div>

                )
            }

            {

                categories.length === 0 ? (

                    <p>
                        No existen categorías.
                    </p>

                ) : (

                    <div className="space-y-4">

                        {

                            categories.map(

                                (category) => (

                                    <div
                                        key={category.id}
                                        className="
                                            border
                                            rounded-xl
                                            p-4
                                        "
                                    >

                                        <h3
                                            className="font-semibold"
                                        >
                                            {category.name}
                                        </h3>

                                        <p>
                                            {
                                                category.description ??
                                                "Sin descripción"
                                            }
                                        </p>

                                        <div className="mt-4 flex gap-3">

                                            <button
                                                onClick={() => {

                                                    setEditingCategoryId(
                                                        category.id
                                                    );

                                                    setName(
                                                        category.name
                                                    );

                                                    setDescription(
                                                        category.description ?? ""
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
                                                    handleDeleteCategory(
                                                        category.id
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