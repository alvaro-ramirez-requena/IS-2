import { useState, useEffect } from "react";

const STATUS_CONFIG = {
  REGISTERED:  { label: "Registrado",   color: "#A78BFA", bg: "#2D1B6B33", step: 1 },
  VALIDATING:  { label: "Validando",    color: "#FCD34D", bg: "#78350F33", step: 2 },
  APPROVED:    { label: "Aprobado",     color: "#34D399", bg: "#06402833", step: 3 },
  REJECTED:    { label: "Rechazado",    color: "#F87171", bg: "#7F1D1D33", step: 3 },
  PRIORITIZED: { label: "Priorizado",   color: "#C084FC", bg: "#3B076433", step: 4 },
  ASSIGNED:    { label: "Asignado",     color: "#60A5FA", bg: "#1E3A5F33", step: 5 },
  IN_PROGRESS: { label: "En progreso",  color: "#FB923C", bg: "#7C2D1233", step: 6 },
  RESOLVED:    { label: "Resuelto",     color: "#4ADE80", bg: "#14532D33", step: 7 },
};

const STEPS = [
  { key: "REGISTERED",  label: "Registrado" },
  { key: "VALIDATING",  label: "Validando"  },
  { key: "APPROVED",    label: "Aprobado"   },
  { key: "PRIORITIZED", label: "Priorizado" },
  { key: "ASSIGNED",    label: "Asignado"   },
  { key: "IN_PROGRESS", label: "En progreso"},
  { key: "RESOLVED",    label: "Resuelto"   },
];

const MOCK_REPORTS = [
  { id: "a1b2c3d4e5f6", title: "Bache en Av. Principal", description: "Bache grande frente al mercado central, peligroso para motos.", location: "Av. Principal 450", status: "IN_PROGRESS", createdAt: "2026-05-01T10:00:00Z" },
  { id: "b2c3d4e5f6a1", title: "Poste de luz apagado",   description: "El poste lleva 3 días sin funcionar, la calle queda oscura.", location: "Jr. Los Pinos 120", status: "ASSIGNED", createdAt: "2026-05-05T14:30:00Z" },
  { id: "c3d4e5f6a1b2", title: "Basura acumulada",        description: "No pasa el camión de basura desde hace una semana.", location: "Calle Real 80", status: "VALIDATING", createdAt: "2026-05-10T08:15:00Z" },
  { id: "d4e5f6a1b2c3", title: "Semáforo dañado",         description: "No cambia de rojo a verde, genera tráfico.", location: "Esquina Bolívar", status: "RESOLVED", createdAt: "2026-04-20T09:00:00Z" },
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.REGISTERED;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 999,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
      fontFamily: "monospace",
      border: `1px solid ${cfg.color}44`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block", boxShadow: `0 0 6px ${cfg.color}` }} />
      {cfg.label.toUpperCase()}
    </span>
  );
}

function ProgressBar({ status }) {
  const current = STATUS_CONFIG[status]?.step ?? 1;
  const isRejected = status === "REJECTED";
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {STEPS.map((s, i) => {
          const stepNum = i + 1;
          const done = !isRejected && current >= stepNum;
          const active = !isRejected && current === stepNum;
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                background: done ? (active ? "#7C3AED" : "#5B21B6") : "#1E1B2E",
                border: active ? "2px solid #A78BFA" : `2px solid ${done ? "#5B21B655" : "#2D2A45"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
                boxShadow: active ? "0 0 10px #7C3AED88" : "none",
              }}>
                {done && !active && <span style={{ color: "#C4B5FD", fontSize: 9, fontWeight: 800 }}>✓</span>}
                {active && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#A78BFA", display: "block" }} />}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2,
                  background: done && current > stepNum ? "#5B21B6" : "#2D2A45",
                  transition: "background 0.3s",
                }} />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", marginTop: 6 }}>
        {STEPS.map((s) => (
          <span key={s.key} style={{
            fontSize: 8, color: "#6B6A8A", fontFamily: "monospace",
            width: `${100 / STEPS.length}%`, textAlign: "center", lineHeight: 1.3,
          }}>{s.label.toUpperCase()}</span>
        ))}
      </div>
      {isRejected && (
        <p style={{ fontSize: 11, color: "#F87171", marginTop: 8, fontFamily: "monospace" }}>
          ✕ Este reporte fue rechazado
        </p>
      )}
    </div>
  );
}

function ReportCard({ report, expanded, onToggle }) {
  const cfg = STATUS_CONFIG[report.status] || STATUS_CONFIG.REGISTERED;
  const date = new Date(report.createdAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div
      onClick={onToggle}
      style={{
        background: expanded ? "#16132A" : "transparent",
        border: `1px solid ${expanded ? cfg.color + "55" : "#2D2A45"}`,
        borderRadius: 12,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: expanded ? `0 0 20px ${cfg.color}18` : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 4px", fontSize: 10, color: "#6B6A8A", fontFamily: "monospace", letterSpacing: "0.08em" }}>
            #{report.id.slice(0, 8).toUpperCase()} · {date}
          </p>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#F0EEFF", lineHeight: 1.3 }}>
            {report.title}
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6B6A8A" }}>
            📍 {report.location}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          <StatusBadge status={report.status} />
          <span style={{
            fontSize: 16, color: "#6B6A8A",
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 0.2s", display: "block",
          }}>⌄</span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 14, borderTop: "1px solid #2D2A45", paddingTop: 14 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6B6A8A", fontFamily: "monospace" }}>DESCRIPCIÓN</p>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#C4B5FD", lineHeight: 1.6 }}>
            {report.description}
          </p>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#6B6A8A", fontFamily: "monospace" }}>PROGRESO</p>
          <ProgressBar status={report.status} />
        </div>
      )}
    </div>
  );
}

export default function MisReportes() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("TODOS");

  // Datos de prueba — reemplazar por fetch real:
  // const res = await fetch(`http://localhost:3000/api/reports/user/${userId}`);
  // const data = await res.json();
  useEffect(() => {
    setTimeout(() => {
      setReports(MOCK_REPORTS);
      setLoading(false);
    }, 600);
  }, []);

  const filtered = filter === "TODOS" ? reports : reports.filter(r => r.status === filter);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0D0B1A; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #13112A; }
        ::-webkit-scrollbar-thumb { background: #3B2F6B; border-radius: 99px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0D0B1A", color: "#F0EEFF", fontFamily: "sans-serif" }}>

        {/* Header */}
        <div style={{ background: "#13112A", borderBottom: "1px solid #2D2A45", padding: "24px 24px 0" }}>
          <p style={{ fontSize: 11, color: "#6B6A8A", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 4 }}>
            REPORTAYA · MIS REPORTES
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#F0EEFF", marginBottom: 18 }}>
            Mis reportes
          </h1>

          {/* Filtros */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 1 }}>
            {["TODOS", "VALIDATING", "IN_PROGRESS", "RESOLVED", "REJECTED"].map(f => {
              const cfg = STATUS_CONFIG[f];
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={(e) => { e.stopPropagation(); setFilter(f); }}
                  style={{
                    padding: "6px 14px", borderRadius: 999,
                    border: `1px solid ${active ? (cfg?.color ?? "#A78BFA") : "#2D2A45"}`,
                    background: active ? (cfg?.bg ?? "#2D1B6B33") : "transparent",
                    color: active ? (cfg?.color ?? "#A78BFA") : "#6B6A8A",
                    fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                    fontFamily: "monospace", letterSpacing: "0.05em",
                    transition: "all 0.15s",
                    boxShadow: active ? `0 0 10px ${cfg?.color ?? "#7C3AED"}33` : "none",
                  }}
                >
                  {f === "TODOS" ? "TODOS" : STATUS_CONFIG[f]?.label.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px", maxWidth: 640, margin: "0 auto" }}>
          {loading ? (
            <p style={{ textAlign: "center", padding: "60px 0", color: "#6B6A8A", fontFamily: "monospace", fontSize: 13 }}>
              Cargando reportes...
            </p>
          ) : filtered.length === 0 ? (
            <div style={{
              border: "1px dashed #2D2A45", borderRadius: 12,
              padding: "40px 20px", textAlign: "center",
              color: "#6B6A8A", fontFamily: "monospace", fontSize: 13,
            }}>
              Aún no hay reportes con este estado.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(r => (
                <ReportCard
                  key={r.id}
                  report={r}
                  expanded={expanded === r.id}
                  onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
                />
              ))}
            </div>
          )}

          <p style={{ textAlign: "center", marginTop: 28, fontSize: 11, color: "#3D3A55", fontFamily: "monospace" }}>
            {filtered.length} reporte{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
}
