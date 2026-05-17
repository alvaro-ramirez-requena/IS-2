import React, { useMemo, useState } from "react";
import "./RegisterReport.css";

type ReportFormValues = {
  title: string;
  description: string;
  location: string;
};

type CreateReportDTO = {
  title: string;
  description: string;
  location: string;
  userId: string;
};

type ApiReport = {
  id: string;
  title: string;
  description: string;
  location: string;
  status:
    | "REGISTERED"
    | "VALIDATING"
    | "APPROVED"
    | "REJECTED"
    | "PRIORITIZED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED";
  userId: string;
  createdAt: string;
  updatedAt: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const reportAdapter = {
  toCreateReportDTO: (
    formData: ReportFormValues,
    userId: string
  ): CreateReportDTO => ({
    title: formData.title.trim(),
    description: formData.description.trim(),
    location: formData.location.trim(),
    userId,
  }),
};

const validateReport = (values: ReportFormValues) => {
  const errors: Partial<Record<keyof ReportFormValues, string>> = {};

  if (!values.title.trim()) errors.title = "El título es obligatorio";
  if (!values.description.trim())
    errors.description = "La descripción es obligatoria";
  if (!values.location.trim()) errors.location = "La ubicación es obligatoria";

  return errors;
};

async function createReport(dto: CreateReportDTO): Promise<ApiReport> {
  const response = await fetch(`${API_URL}/api/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    let message = "No se pudo registrar el reporte";
    try {
      const error = await response.json();
      message = error?.message ?? message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export default function RegisterReport() {
  const [formData, setFormData] = useState<ReportFormValues>({
    title: "",
    description: "",
    location: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ReportFormValues, string>>
  >({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState<ApiReport[]>([]);

  const userId = localStorage.getItem("userId") ?? "demo-user-id";

  const canSubmit = useMemo(() => {
    return (
      formData.title.trim() &&
      formData.description.trim() &&
      formData.location.trim()
    );
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateReport(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setMessage("Revisa los campos obligatorios.");
      return;
    }

    try {
      setIsSubmitting(true);
      const dto = reportAdapter.toCreateReportDTO(formData, userId);
      const created = await createReport(dto);

      setReports((prev) => [created, ...prev]);
      setFormData({ title: "", description: "", location: "" });
      setMessage("Reporte registrado correctamente.");
    } catch (error: any) {
      setMessage(error?.message ?? "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="registerShell">
        <header className="registerHero">
          <p className="registerKicker">Módulo de reportes</p>
          <h1 className="registerTitle">Registro de problemas del distrito</h1>
          <p className="registerSubtitle">
            Reporta incidencias de forma rápida y simple para dar seguimiento.
          </p>
        </header>

        <section className="registerCard">
          <h2>Registrar reporte</h2>
          <p className="registerHint">
            Campos obligatorios: título, descripción y ubicación.
          </p>

          <form className="registerForm" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Título *</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej. Bache grande"
              />
              {errors.title && <p className="error">{errors.title}</p>}
            </div>

            <div className="field">
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe el problema con claridad"
                rows={5}
              />
              {errors.description && <p className="error">{errors.description}</p>}
            </div>

            <div className="field">
              <label htmlFor="location">Ubicación *</label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej. Av. Lima"
              />
              {errors.location && <p className="error">{errors.location}</p>}
            </div>

            <button className="submit" type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar reporte"}
            </button>

            {message && <div className="message">{message}</div>}
          </form>
        </section>

        <section className="registerCard">
          <h2>Reportes creados</h2>
          <p className="registerHint">
            Aquí verás los reportes que se van registrando.
          </p>

          <div className="list">
            {reports.length === 0 ? (
              <div className="empty">
                Aún no hay reportes creados desde este frontend.
              </div>
            ) : (
              reports.map((report) => (
                <article key={report.id} className="report">
                  <h3>{report.title}</h3>
                  <p>{report.description}</p>
                  <div className="reportMeta">
                    <span className="tag">{report.location}</span>
                    <span className="tag">Estado: {report.status}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}