import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  MapPin,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  districtId?: string | null;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

type District = {
  id: string;
  name: string;
  slug: string;
};

async function requestJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message ?? "No se pudo completar la solicitud");
  }

  return data as T;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message ?? "No se pudo cargar la información");
  }

  return data as T;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingDistricts, setLoadingDistricts] = useState(true);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [districts, setDistricts] = useState<District[]>([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    districtId: "",
  });

  const canSubmit = useMemo(
    () =>
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.password.trim().length >= 8,
    [form]
  );

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      navigate("/dashboard", { replace: true });
      return;
    }

    async function loadDistricts() {
      try {
        const data = await getJson<District[]>("/api/districts");
        setDistricts(data);
      } catch (error) {
        console.error(error);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    }

    void loadDistricts();
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        districtId: form.districtId || null,
      };

      const result = await requestJson<AuthResponse>(
        "/api/auth/register",
        payload
      );

      localStorage.setItem("auth_token", result.token);

      localStorage.setItem("auth_user", JSON.stringify(result.user));

      setSuccessMessage("Registro exitoso. Redirigiendo...");

      window.setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 700);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la cuenta"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden border-b border-slate-800 px-6 py-12 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_28%)]" />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                Únete y ayuda a mejorar tu distrito
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                Crea tu cuenta de ciudadano.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Regístrate para reportar problemas de tu comunidad y hacer
                seguimiento a tus incidencias.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <InfoCard
                title="Nombre y correo"
                description="Registro simple y directo para ciudadanos."
              />

              <InfoCard
                title="Validación"
                description="Evita correos duplicados en el sistema."
              />

              <InfoCard
                title="Distrito opcional"
                description="Selecciona tu distrito para personalizar tu experiencia."
              />
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Crear cuenta
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Completa tus datos para comenzar.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-cyan-400">
                <UserPlus className="h-5 w-5" />
              </div>
            </div>

            {errorMessage && (
              <Notice
                tone="error"
                icon={<AlertCircle className="h-4 w-4" />}
                text={errorMessage}
              />
            )}

            {successMessage && (
              <Notice
                tone="success"
                icon={<CheckCircle2 className="h-4 w-4" />}
                text={successMessage}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nombres"
                  value={form.firstName}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      firstName: value,
                    }))
                  }
                  placeholder="Juan"
                />

                <Field
                  label="Apellidos"
                  value={form.lastName}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      lastName: value,
                    }))
                  }
                  placeholder="Pérez"
                />
              </div>

              <Field
                label="Correo electrónico"
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    email: value,
                  }))
                }
                placeholder="juan@email.com"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Contraseña
                </label>

                <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 focus-within:border-cyan-500">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    placeholder="Mínimo 8 caracteres"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 transition hover:text-white"
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Distrito (opcional)
                </label>

                <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 focus-within:border-cyan-500">
                  <MapPin className="h-4 w-4 text-slate-500" />

                  <select
                    value={form.districtId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        districtId: e.target.value,
                      }))
                    }
                    className="w-full bg-transparent text-sm text-white outline-none"
                    disabled={loadingDistricts}
                  >
                    <option value="" className="bg-slate-950 text-white">
                      {loadingDistricts
                        ? "Cargando distritos..."
                        : "Sin distrito"}
                    </option>

                    {districts.map((district) => (
                      <option
                        key={district.id}
                        value={district.id}
                        className="bg-slate-950 text-white"
                      >
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}

                Registrarme
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-5 text-center text-sm text-slate-400">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-medium text-cyan-400 hover:text-cyan-300"
              >
                Inicia sesión
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
      />
    </div>
  );
}

function Notice({
  tone,
  text,
  icon,
}: {
  tone: "error" | "success";
  text: string;
  icon: ReactNode;
}) {
  const styles =
    tone === "error"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-100"
      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-100";

  return (
    <div
      className={`mb-4 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${styles}`}
    >
      <span className="mt-0.5">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
      <h3 className="font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}