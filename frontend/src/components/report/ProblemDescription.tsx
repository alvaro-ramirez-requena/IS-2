type ProblemDescriptionProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

export default function ProblemDescription({
  value,
  onChange,
  maxLength = 500,
}: ProblemDescriptionProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="description" className="block text-sm font-medium text-slate-700">
        Descripción del problema <span className="text-red-500">*</span>
      </label>

      <textarea
        id="description"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Describe lo que está ocurriendo..."
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="text-right text-xs text-slate-500">
        {value.length}/{maxLength}
      </div>
    </div>
  );
}