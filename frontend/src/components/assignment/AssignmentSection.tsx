import { useEffect, useMemo, useState } from "react";

import { AssignmentService } from "../../services/assignment.service";

import type { Technician } from "../../types/assignment.types";

import {
  getCompatibilityLabel,
  getSuggestedSkillByProblemType,
  getTechnicianScore,
  technicianHasSkill,
} from "../../utils/assignment.utils";

type AssignmentSectionProps = {
  reportId: string;
  reportTitle?: string;
  problemType?: string;
  suggestedSkillName?: string;
  address?: string;
  priority?: string;
  municipalityId?: string;
  municipalityName?: string;
  onAssigned?: () => void;
  isReassignment?: boolean;
};

export default function AssignmentSection({
  reportId,
  reportTitle,
  problemType,
  suggestedSkillName,
  priority,
  municipalityId,
  municipalityName,
  onAssigned,
  isReassignment = false,
}: AssignmentSectionProps) {
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [specialtyFilter, setSpecialtyFilter] = useState("");

  const [notes, setNotes] = useState("");

  const currentUserId = localStorage.getItem("userId") || "";

  const suggestedSkill =
    suggestedSkillName ||
    getSuggestedSkillByProblemType(problemType);

  useEffect(() => {
    if (suggestedSkill) {
      setSpecialtyFilter(suggestedSkill);
      setSelectedTechnicianId("");
    }
  }, [suggestedSkill]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await AssignmentService.getTechnicians({
          municipalityId,
          availability: true,
        });

        setTechnicians(data || []);
      } catch (error: any) {
        setError(error.message || "No se pudieron cargar los técnicos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [municipalityId]);

  const specialties = useMemo(() => {
    const values = technicians.flatMap((technician) => technician.technicianProfile?.skills || []);

    return Array.from(new Set(values));
  }, [technicians]);

  const filteredTechnicians = useMemo(() => {
    return technicians
      .filter((technician) => {
        const profile = technician.technicianProfile;

        if (!profile) {
          return false;
        }

        if (
          specialtyFilter &&
          !technicianHasSkill(technician, specialtyFilter)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const scoreA = getTechnicianScore(a, suggestedSkill);

        const scoreB = getTechnicianScore(b, suggestedSkill);

        return scoreB - scoreA;
      });
  }, [technicians, specialtyFilter, suggestedSkill]);

  const selectedTechnician = filteredTechnicians.find(
    (technician) => technician.id === selectedTechnicianId
  );

  const selectedScore = selectedTechnician
    ? getTechnicianScore(selectedTechnician, suggestedSkill)
    : 0;

  const handleApplySuggestedSkill = () => {
    if (suggestedSkill) {
      setSpecialtyFilter(suggestedSkill);
      setSelectedTechnicianId("");
    }
  };

  const handleAssign = async () => {
    if (!selectedTechnicianId) {
      setError("Selecciona un técnico antes de asignar.");
      return;
    }

    if (!currentUserId) {
      setError("No se encontró el usuario operador en sesión.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const assignmentData = {
        reportId,
        technicianId: selectedTechnicianId,
        assignedById: currentUserId,
        notes,
      };

      if (isReassignment) {
        await AssignmentService.reassignTechnician(assignmentData);
      } else {
        await AssignmentService.assignTechnician(assignmentData);
      }

      setSuccessMessage(
        isReassignment ? "Técnico reasignado correctamente." : "Técnico asignado correctamente."
      );

      if (onAssigned) {
        onAssigned();
      }
    } catch (error: any) {
      setError(error.message || "No se pudo asignar el técnico.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      className="
            bg-white
            border
            rounded-3xl
            p-6
            shadow-sm
            space-y-6
        "
    >
      <div>
        <p
          className="
                    text-blue-700
                    font-semibold
                    text-sm
                "
        >
          Gestión operativa
        </p>

        <h2
          className="
                    text-3xl
                    font-bold
                    text-[#03152E]
                    leading-tight
                    mt-1
                "
        >
          Asignación de técnico
        </h2>

        <p
          className="
                    text-gray-500
                    mt-2
                    leading-relaxed
                "
        >
          Selecciona un técnico disponible de la municipalidad correspondiente al reporte.
        </p>
      </div>

      <div
        className="
                bg-blue-50
                border
                border-blue-200
                rounded-2xl
                p-5
                space-y-3
            "
      >
        <h3
          className="
                    font-bold
                    text-[#03152E]
                    text-lg
                "
        >
          Reporte a asignar
        </h3>

        <p className="text-gray-700">
          <strong>Título:</strong> {reportTitle || "Reporte sin título"}
        </p>

        <p className="text-gray-700">
          <strong>Tipo:</strong> {problemType || "No especificado"}
        </p>

        <p className="text-gray-700">
          <strong>Municipalidad:</strong> {municipalityName || "No definida"}
        </p>

        <p className="text-gray-700">
          <strong>Prioridad:</strong> {priority || "No definida"}
        </p>

        {suggestedSkill && (
          <div
            className="
                        bg-white
                        border
                        border-green-200
                        text-green-700
                        rounded-xl
                        px-4
                        py-3
                        font-semibold
                        text-sm
                    "
          >
            Especialidad sugerida: {suggestedSkill}
          </div>
        )}
      </div>

      <div
        className="
                bg-gray-50
                border
                rounded-2xl
                p-5
                space-y-4
            "
      >
        <h3
          className="
                    font-bold
                    text-[#03152E]
                    text-lg
                "
        >
          Filtros
        </h3>

        <div
          className="
                    bg-blue-50
                    border
                    border-blue-100
                    rounded-xl
                    p-4
                    text-sm
                    text-blue-700
                    font-semibold
                "
        >
          Los técnicos se filtran automáticamente por la municipalidad del reporte.
        </div>

        <div>
          <label
            className="
                        block
                        font-semibold
                        text-[#03152E]
                        mb-2
                    "
          >
            Especialidad
          </label>

          <select
            value={specialtyFilter}
            onChange={(event) => {
              setSpecialtyFilter(event.target.value);
              setSelectedTechnicianId("");
            }}
            className="
                            w-full
                            border
                            rounded-xl
                            px-4
                            py-3
                            bg-white
                        "
          >
              <option value="">Todas las especialidades</option>

              {suggestedSkill && !specialties.includes(suggestedSkill) && (
                <option value={suggestedSkill}>
                  {suggestedSkill}
                </option>
              )}

              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
          </select>
        </div>

        {suggestedSkill && (
          <button
            type="button"
            onClick={handleApplySuggestedSkill}
            className="
                            w-full
                            bg-blue-50
                            border
                            border-blue-200
                            text-blue-700
                            font-bold
                            rounded-xl
                            px-4
                            py-3
                            hover:bg-blue-100
                            transition
                        "
          >
            Aplicar especialidad sugerida
          </button>
        )}
      </div>

      <div
        className="
                bg-white
                border
                rounded-2xl
                p-5
                space-y-4
            "
      >
        <h3
          className="
                    font-bold
                    text-[#03152E]
                    text-lg
                "
        >
          Técnico a asignar
        </h3>

        {loading ? (
          <p className="text-gray-500">Cargando técnicos disponibles...</p>
        ) : filteredTechnicians.length === 0 ? (
          <div
            className="
                        bg-yellow-50
                        border
                        border-yellow-200
                        rounded-xl
                        p-4
                        text-yellow-700
                    "
          >
            No se encontraron técnicos disponibles con los filtros seleccionados.
          </div>
        ) : (
          <>
            <select
              value={selectedTechnicianId}
              onChange={(event) => setSelectedTechnicianId(event.target.value)}
              className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                bg-white
                            "
            >
              <option value="">Selecciona un técnico</option>

              {filteredTechnicians.map((technician) => {
                const score = getTechnicianScore(technician, suggestedSkill);

                const compatibility = getCompatibilityLabel(score);

                return (
                  <option key={technician.id} value={technician.id}>
                    {technician.firstName} {technician.lastName} - Compatibilidad {compatibility}
                  </option>
                );
              })}
            </select>

            <p
              className="
                            text-sm
                            text-gray-500
                        "
            >
              Técnicos disponibles encontrados: <strong>{filteredTechnicians.length}</strong>
            </p>
          </>
        )}
      </div>

      {selectedTechnician && (
        <div
          className="
                    bg-blue-50
                    border
                    border-blue-200
                    rounded-2xl
                    p-5
                    space-y-4
                "
        >
          <div
            className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
          >
            <div>
              <h3
                className="
                                text-2xl
                                font-bold
                                text-[#03152E]
                            "
              >
                {selectedTechnician.firstName} {selectedTechnician.lastName}
              </h3>

              <p
                className="
                                text-sm
                                text-gray-600
                                break-all
                                mt-1
                            "
              >
                {selectedTechnician.email}
              </p>
            </div>

            <span
              className="
                            bg-green-100
                            text-green-700
                            text-xs
                            px-3
                            py-1
                            rounded-full
                            font-bold
                        "
            >
              Disponible
            </span>
          </div>

          <div
            className="
                        grid
                        grid-cols-1
                        gap-3
                        text-sm
                        text-gray-700
                    "
          >
            <p>
              <strong>Municipalidad:</strong>{" "}
              {selectedTechnician.technicianProfile?.municipality?.name || "No definida"}
            </p>

            <p>
              <strong>Cuadrilla:</strong>{" "}
              {selectedTechnician.technicianProfile?.crewName || "No asignada"}
            </p>

            <p>
              <strong>Compatibilidad:</strong>{" "}
              <span
                className="
                                font-bold
                                text-blue-700
                            "
              >
                {getCompatibilityLabel(selectedScore)}
              </span>
            </p>
          </div>

          <div>
            <strong
              className="
                            text-sm
                            text-gray-700
                        "
            >
              Especialidades:
            </strong>

            <div
              className="
                            flex
                            flex-wrap
                            gap-2
                            mt-2
                        "
            >
              {selectedTechnician.technicianProfile?.skills?.length ? (
                selectedTechnician.technicianProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="
                                                    bg-white
                                                    text-gray-700
                                                    rounded-full
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    border
                                                "
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span
                  className="
                                            text-gray-500
                                            text-sm
                                        "
                >
                  No registradas
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <label
          className="
                    block
                    font-semibold
                    text-[#03152E]
                    mb-2
                "
        >
          Observaciones para la asignación
        </label>

        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Ejemplo: atender en horario de menor tránsito o coordinar con seguridad ciudadana."
          className="
                        w-full
                        border
                        rounded-2xl
                        px-4
                        py-3
                        min-h-[100px]
                        resize-none
                    "
        />
      </div>

      {error && (
        <div
          className="
                    bg-red-50
                    border
                    border-red-200
                    text-red-700
                    rounded-2xl
                    p-4
                    font-semibold
                "
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          className="
                    bg-green-50
                    border
                    border-green-200
                    text-green-700
                    rounded-2xl
                    p-4
                    font-semibold
                "
        >
          {successMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleAssign}
        disabled={saving || !selectedTechnicianId}
        className="
                    w-full
                    bg-blue-700
                    text-white
                    font-bold
                    text-lg
                    rounded-2xl
                    py-4
                    hover:bg-blue-800
                    transition
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                "
      >
        {saving
          ? "Asignando..."
          : isReassignment
            ? "Reasignar técnico"
            : selectedTechnician
              ? `Asignar a ${selectedTechnician.firstName} ${selectedTechnician.lastName}`
              : "Selecciona un técnico"}
      </button>
    </section>
  );
}
