import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { TechnicianApplicationService } from "../services/technicianApplication.service";

interface TechnicianApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dni?: string;
  municipality?: {
    id: string;
    name: string;
  };
  skills: string[];
  experience?: string;
  status: string;
  createdAt: string;
}

export default function OperatorTechnicianApplicationsPage() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState<TechnicianApplication[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await TechnicianApplicationService.getPendingApplications();

      setApplications(data);
    } catch (error: any) {
      setError(error.message || "No se pudieron cargar las postulaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleApprove = async (applicationId: string) => {
    try {
      setError("");
      setSuccess("");

      const reviewedById = localStorage.getItem("userId") || undefined;

      const result = await TechnicianApplicationService.approveApplication(
        applicationId,
        reviewedById
      );

      setSuccess(
        `Postulación aprobada. Usuario técnico creado con contraseña temporal: ${result.temporaryPassword}`
      );

      setApplications((prev) => prev.filter((item) => item.id !== applicationId));
    } catch (error: any) {
      setError(error.message || "No se pudo aprobar la postulación.");
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      setError("");
      setSuccess("");

      const reviewedById = localStorage.getItem("userId") || undefined;

      await TechnicianApplicationService.rejectApplication(applicationId, reviewedById);

      setSuccess("Postulación rechazada correctamente.");

      setApplications((prev) => prev.filter((item) => item.id !== applicationId));
    } catch (error: any) {
      setError(error.message || "No se pudo rechazar la postulación.");
    }
  };

  return (
    <div
      className="
            min-h-screen
            bg-gray-100
        "
    >
      <header
        className="
                bg-[#03152E]
                text-white
                px-8
                py-5
                flex
                items-center
                justify-between
                shadow
            "
      >
        <h1
          className="
                    text-2xl
                    font-bold
                "
        >
          reporta
          <span className="text-yellow-400">Ya</span>
        </h1>

        <button
          onClick={() => navigate("/operator")}
          className="
                        px-4
                        py-2
                        rounded-lg
                        bg-white
                        text-[#03152E]
                        font-semibold
                        hover:bg-gray-100
                    "
        >
          Volver al panel
        </button>
      </header>

      <main
        className="
                max-w-6xl
                mx-auto
                px-6
                py-10
            "
      >
        <div
          className="
                    mb-8
                "
        >
          <p
            className="
                        text-blue-700
                        font-semibold
                        text-sm
                    "
          >
            Gestión de técnicos
          </p>

          <h2
            className="
                        text-4xl
                        font-bold
                        text-[#03152E]
                        mt-2
                    "
          >
            Postulaciones de técnicos de campo
          </h2>

          <p
            className="
                        text-gray-600
                        mt-3
                    "
          >
            Revisa las solicitudes pendientes y decide si el postulante será incorporado al equipo
            técnico.
          </p>
        </div>

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

        {success && (
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
            {success}
          </div>
        )}

        {loading ? (
          <div
            className="
                        bg-white
                        border
                        rounded-2xl
                        p-8
                        text-gray-600
                    "
          >
            Cargando postulaciones...
          </div>
        ) : applications.length === 0 ? (
          <div
            className="
                        bg-white
                        border
                        rounded-2xl
                        p-8
                        text-gray-600
                    "
          >
            No hay postulaciones pendientes.
          </div>
        ) : (
          <div
            className="
                        grid
                        grid-cols-1
                        gap-6
                    "
          >
            {applications.map((application) => (
              <article
                key={application.id}
                className="
                                    bg-white
                                    border
                                    rounded-2xl
                                    p-6
                                    shadow-sm
                                "
              >
                <div
                  className="
                                    flex
                                    flex-col
                                    lg:flex-row
                                    lg:items-start
                                    lg:justify-between
                                    gap-6
                                "
                >
                  <div>
                    <div
                      className="
                                            flex
                                            items-center
                                            gap-3
                                            flex-wrap
                                        "
                    >
                      <h3
                        className="
                                                text-2xl
                                                font-bold
                                                text-[#03152E]
                                            "
                      >
                        {application.firstName} {application.lastName}
                      </h3>

                      <span
                        className="
                                                text-xs
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-yellow-100
                                                text-yellow-700
                                                font-semibold
                                            "
                      >
                        Pendiente
                      </span>
                    </div>

                    <div
                      className="
                                            mt-4
                                            grid
                                            grid-cols-1
                                            md:grid-cols-2
                                            gap-3
                                            text-sm
                                            text-gray-600
                                        "
                    >
                      <p>
                        <strong>Correo:</strong> {application.email}
                      </p>

                      <p>
                        <strong>Teléfono:</strong> {application.phone || "No indicado"}
                      </p>

                      <p>
                        <strong>DNI:</strong> {application.dni || "No indicado"}
                      </p>

                      <p>
                        <strong>Municipalidad:</strong>{" "}
                        {application.municipality?.name || "No indicado"}
                      </p>
                    </div>

                    <div
                      className="
                                            mt-4
                                        "
                    >
                      <p
                        className="
                                                text-sm
                                                font-semibold
                                                text-gray-700
                                                mb-2
                                            "
                      >
                        Habilidades
                      </p>

                      <div
                        className="
                                                flex
                                                flex-wrap
                                                gap-2
                                            "
                      >
                        {application.skills.map((skill) => (
                          <span
                            key={skill}
                            className="
                                                            text-xs
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            bg-blue-50
                                                            text-blue-700
                                                            font-semibold
                                                        "
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="
                                            mt-4
                                        "
                    >
                      <p
                        className="
                                                text-sm
                                                font-semibold
                                                text-gray-700
                                            "
                      >
                        Experiencia
                      </p>

                      <p
                        className="
                                                text-sm
                                                text-gray-600
                                                mt-1
                                                leading-relaxed
                                            "
                      >
                        {application.experience || "No se registró experiencia."}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        min-w-[180px]
                                    "
                  >
                    <button
                      onClick={() => handleApprove(application.id)}
                      className="
                                                px-5
                                                py-3
                                                rounded-xl
                                                bg-green-600
                                                text-white
                                                font-semibold
                                                hover:bg-green-700
                                            "
                    >
                      Aprobar
                    </button>

                    <button
                      onClick={() => handleReject(application.id)}
                      className="
                                                px-5
                                                py-3
                                                rounded-xl
                                                bg-red-600
                                                text-white
                                                font-semibold
                                                hover:bg-red-700
                                            "
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
