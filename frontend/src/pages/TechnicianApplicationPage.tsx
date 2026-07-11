import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  MunicipalityService,
} from "../services/municipality.service";

import type {
  Municipality,
} from "../services/municipality.service";

import {
  TechnicianApplicationService,
} from "../services/technicianApplication.service";

import {
  TechnicianSkillService,
} from "../services/technicianSkill.service";

import type {
  TechnicianSkill,
} from "../services/technicianSkill.service";

type TechnicianApplicationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  municipalityId: string;
  skills: string[];
  experience: string;
};

export default function TechnicianApplicationPage() {
  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState<TechnicianApplicationFormData>({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dni: "",
      municipalityId: "",
      skills: [],
      experience: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [catalogLoading, setCatalogLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [municipalities, setMunicipalities] =
    useState<Municipality[]>([]);

  const [skillOptions, setSkillOptions] =
    useState<TechnicianSkill[]>([]);

  useEffect(() => {
    const loadInitialData =
      async () => {
        try {
          setCatalogLoading(true);
          setError("");

          const [
            municipalitiesData,
            skillsData,
          ] =
            await Promise.all([
              MunicipalityService.getAll(),
              TechnicianSkillService.getActive(),
            ]);

          setMunicipalities(
            municipalitiesData
          );

          setSkillOptions(
            skillsData
          );

        } catch (error) {
          console.error(error);

          setError(
            "No se pudieron cargar las municipalidades o habilidades técnicas."
          );

        } finally {
          setCatalogLoading(false);
        }
      };

    loadInitialData();
  }, []);

  const handleChange =
    (
      event: ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
      >
    ) => {
      const {
        name,
        value,
      } = event.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

  const handleSkillChange =
    (
      skillName: string
    ) => {
      setFormData((prev) => {
        const alreadySelected =
          prev.skills.includes(skillName);

        return {
          ...prev,
          skills: alreadySelected
            ? prev.skills.filter(
              (item) =>
                item !== skillName
            )
            : [
              ...prev.skills,
              skillName,
            ],
        };
      });
    };

  const handleSubmit =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      setError("");
      setMessage("");

      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.email.trim()
      ) {
        setError(
          "Nombres, apellidos y correo son obligatorios."
        );

        return;
      }

      if (!formData.municipalityId) {
        setError(
          "Debes seleccionar una municipalidad."
        );

        return;
      }

      if (formData.skills.length === 0) {
        setError(
          "Debes seleccionar al menos una habilidad."
        );

        return;
      }

      try {
        setLoading(true);

        await TechnicianApplicationService.createApplication({
          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          dni:
            formData.dni.trim(),

          municipalityId:
            formData.municipalityId,

          experience:
            formData.experience.trim(),

          skills:
            formData.skills,
        });

        setMessage(
          "Tu postulación fue registrada correctamente. Revisa tu correo para verificar la solicitud."
        );

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dni: "",
          municipalityId: "",
          experience: "",
          skills: [],
        });

      } catch (error: any) {
        setError(
          error.message ||
          "No se pudo registrar la postulación."
        );

      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        flex
        items-center
        justify-center
        px-6
        py-10
      "
    >
      <div
        className="
          w-full
          max-w-3xl
          bg-white
          rounded-2xl
          shadow-lg
          border
          p-8
        "
      >
        <div
          className="
            mb-8
          "
        >
          <h1
            className="
              text-3xl
              font-bold
              text-[#03152E]
            "
          >
            Postulación de técnico de campo
          </h1>

          <p
            className="
              text-gray-600
              mt-2
            "
          >
            Completa tus datos para que el operador municipal pueda evaluar tu incorporación al
            equipo técnico.
          </p>
        </div>

        {message && (
          <div
            className="
              mb-6
              p-4
              rounded-xl
              bg-green-50
              text-green-700
              border
              border-green-200
            "
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="
              mb-6
              p-4
              rounded-xl
              bg-red-50
              text-red-700
              border
              border-red-200
            "
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="
            space-y-6
          "
        >
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            "
          >
            <div>
              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                "
              >
                Nombres
              </label>

              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                placeholder="Carlos"
              />
            </div>

            <div>
              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                "
              >
                Apellidos
              </label>

              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                placeholder="Ramírez"
              />
            </div>

            <div>
              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                "
              >
                Correo
              </label>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                placeholder="tecnico@gmail.com"
              />
            </div>

            <div>
              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                "
              >
                Teléfono
              </label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                placeholder="999888777"
              />
            </div>

            <div>
              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                "
              >
                DNI
              </label>

              <input
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                placeholder="76543210"
              />
            </div>

            <div>
              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                "
              >
                Municipalidad a la que postula
              </label>

              <select
                name="municipalityId"
                value={formData.municipalityId}
                onChange={handleChange}
                className="
                  w-full
                  rounded-2xl
                  border
                  px-4
                  py-4
                  bg-white
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
          </div>

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-3
              "
            >
              Habilidades
            </label>

            {catalogLoading ? (
              <div
                className="
                  border
                  rounded-xl
                  p-5
                  text-gray-500
                  bg-gray-50
                "
              >
                Cargando habilidades técnicas...
              </div>
            ) : skillOptions.length === 0 ? (
              <div
                className="
                  border
                  rounded-xl
                  p-5
                  text-gray-500
                  bg-gray-50
                "
              >
                No hay habilidades técnicas activas disponibles.
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-3
                "
              >
                {skillOptions.map((skill) => (
                  <label
                    key={skill.id}
                    className="
                      flex
                      items-start
                      gap-3
                      border
                      rounded-xl
                      px-4
                      py-3
                      cursor-pointer
                      hover:bg-gray-50
                    "
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={
                        formData.skills.includes(
                          skill.name
                        )
                      }
                      onChange={() =>
                        handleSkillChange(
                          skill.name
                        )
                      }
                    />

                    <span>
                      <span
                        className="
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        {skill.name}
                      </span>

                      {skill.description && (
                        <span
                          className="
                            block
                            text-xs
                            text-gray-500
                            mt-1
                          "
                        >
                          {skill.description}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-2
              "
            >
              Experiencia
            </label>

            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={4}
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                outline-none
                resize-none
                focus:ring-2
                focus:ring-blue-500
              "
              placeholder="Describe brevemente tu experiencia en mantenimiento, limpieza pública, reparación u otras labores técnicas."
            />
          </div>

          <div
            className="
              flex
              flex-col
              md:flex-row
              gap-4
              justify-end
            "
          >
            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              className="
                px-6
                py-3
                rounded-xl
                border
                font-semibold
                hover:bg-gray-50
              "
            >
              Volver al login
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                catalogLoading ||
                skillOptions.length === 0
              }
              className="
                px-6
                py-3
                rounded-xl
                bg-[#03152E]
                text-white
                font-semibold
                hover:bg-[#08264f]
                disabled:opacity-60
              "
            >
              {
                loading
                  ? "Enviando..."
                  : "Enviar postulación"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}