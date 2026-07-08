import { useEffect, useState } from "react";

import {
    AssignmentService,
} from "../../services/assignment.service";

import type {
    Technician,
} from "../../types/assignment.types";

import Button
    from "../ui/Button";

type Props = {
    reportId: string;
    onAssigned: () => void;
    isReassignment: boolean;
};

export default function AssignmentSection({
    reportId,
    onAssigned,
    isReassignment,
}: Props) {

    const [
        technicians,
        setTechnicians,
    ] = useState<Technician[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        selectedTechnician,
        setSelectedTechnician,
    ] = useState<string | null>(null);

    const [
        assigning,
        setAssigning,
    ] = useState(false);

    const [
        success,
        setSuccess,
    ] = useState("");

    const [
        assignError,
        setAssignError,
    ] = useState("");

    const [
        zone,
        setZone,
    ] = useState("");

    const [
        specialty,
        setSpecialty,
    ] = useState("");

    const [
        availability,
        setAvailability,
    ] = useState(true);

    useEffect(() => {

        loadTechnicians();

    }, [
        zone,
        specialty,
        availability,
    ]);

    async function loadTechnicians() {

        try {

            const data =
                await AssignmentService.getTechnicians({

                    zone,

                    specialty,

                    availability,

                });

            setTechnicians(data);

        } catch (error: any) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    }

    async function handleAssign() {

        if (!selectedTechnician) {
            return;
        }

        try {

            setAssigning(true);

            setAssignError("");

            setSuccess("");

            const assignedById =
                localStorage.getItem("userId");

            if (!assignedById) {
                throw new Error(
                    "No se encontró el usuario logueado"
                );
            }

            if (isReassignment) {

                await AssignmentService.reassignReport({

                    reportId,

                    technicianId:
                        selectedTechnician,

                    assignedById,

                });

            } else {

                await AssignmentService.assignReport({

                    reportId,

                    technicianId:
                        selectedTechnician,

                    assignedById,

                });

            }

            onAssigned();

            setSuccess(
                isReassignment
                    ? "Técnico reasignado correctamente"
                    : "Técnico asignado correctamente"
            );

        } catch (error: any) {

            setAssignError(
                error.message
            );

        } finally {

            setAssigning(false);

        }

    }

    if (loading) {

        return (

            <p className="text-gray-500">
                Cargando técnicos...
            </p>

        );

    }

    if (error) {

        return (

            <p className="text-red-500">
                {error}
            </p>

        );

    }

    return (

        <div className="mt-10">

            <h2
                className="
          text-2xl
          font-bold
          mb-6
        "
            >
                Asignación de Técnico
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div>

                    <label className="block font-semibold mb-1">
                        Zona
                    </label>

                    <select
                        value={zone}
                        onChange={(e) =>
                            setZone(e.target.value)
                        }
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="">
                            Todas
                        </option>

                        <option value="Norte">
                            Norte
                        </option>

                        <option value="Sur">
                            Sur
                        </option>

                        <option value="Este">
                            Este
                        </option>

                        <option value="Oeste">
                            Oeste
                        </option>

                    </select>

                </div>

                <div>

                    <label className="block font-semibold mb-1">
                        Especialidad
                    </label>

                    <select
                        value={specialty}
                        onChange={(e) =>
                            setSpecialty(e.target.value)
                        }
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="">
                            Todas
                        </option>

                        <option value="Infraestructura">
                            Infraestructura
                        </option>

                        <option value="Seguridad">
                            Seguridad
                        </option>

                        <option value="Limpieza">
                            Limpieza
                        </option>

                    </select>

                </div>

                <div>

                    <label className="block font-semibold mb-1">
                        Disponibilidad
                    </label>

                    <select
                        value={
                            availability
                                ? "true"
                                : "false"
                        }
                        onChange={(e) =>
                            setAvailability(
                                e.target.value === "true"
                            )
                        }
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="true">
                            Disponibles
                        </option>

                        <option value="false">
                            No disponibles
                        </option>

                    </select>

                </div>

            </div>

            <div
                className="
          border
          rounded-2xl
          p-6
          space-y-4
        "
            >

                {

                    technicians.length === 0 && (

                        <p>
                            No hay técnicos disponibles.
                        </p>

                    )

                }

                {

                    technicians.map(

                        (technician) => (

                            <div
                                key={technician.id}
                                onClick={() =>
                                    setSelectedTechnician(
                                        technician.id
                                    )
                                }
                                className={`
    border
    rounded-xl
    p-4
    cursor-pointer
    transition

    ${selectedTechnician ===
                                        technician.id
                                        ? "border-blue-600 bg-blue-50"
                                        : "hover:bg-gray-50"
                                    }
  `}
                            >

                                <h3
                                    className="
                    font-semibold
                    text-lg
                  "
                                >
                                    {technician.firstName}{" "}
                                    {technician.lastName}
                                </h3>

                                {selectedTechnician ===
                                    technician.id && (

                                        <p
                                            className="
      text-blue-700
      font-semibold
      mb-2
    "
                                        >
                                            ✓ Técnico seleccionado
                                        </p>

                                    )}

                                <p>

                                    <strong>
                                        Especialidad:
                                    </strong>{" "}

                                    {
                                        technician.specialty ??
                                        "-"
                                    }

                                </p>

                                <p>

                                    <strong>
                                        Zona:
                                    </strong>{" "}

                                    {
                                        technician.zone ??
                                        "-"
                                    }

                                </p>

                                <p>

                                    <strong>
                                        Disponibilidad:
                                    </strong>{" "}

                                    {

                                        technician.availability
                                            ? "Disponible"
                                            : "No disponible"

                                    }

                                </p>

                            </div>

                        )

                    )

                }

            </div>

            {assignError && (

                <p className="text-red-600 mb-4">
                    {assignError}
                </p>

            )}

            {success && (

                <p className="text-green-600 mb-4">
                    {success}
                </p>

            )}

            <div className="mt-6">

                <Button
                    onClick={handleAssign}
                    disabled={
                        !selectedTechnician ||
                        assigning
                    }
                >
                    {
                        assigning
                            ? (
                                isReassignment
                                    ? "Reasignando..."
                                    : "Asignando..."
                            )
                            : (
                                isReassignment
                                    ? "Reasignar Técnico"
                                    : "Asignar Técnico"
                            )
                    }
                </Button>

            </div>

        </div>

    );

}