type AnonymousToggleProps = {
  enabled: boolean;
  onToggle: (value: boolean) => void;
};

export default function AnonymousToggle({ enabled, onToggle }: AnonymousToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-medium text-slate-800">
          ¿Deseas enviar el reporte de forma anónima?
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Tu identidad no será visible para otros usuarios.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        className={[
          "relative h-7 w-12 rounded-full transition",
          enabled ? "bg-blue-600" : "bg-slate-300",
        ].join(" ")}
        aria-pressed={enabled}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
            enabled ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}