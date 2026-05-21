import { problemCategories } from "../../data/ProblemCategories";

type ProblemTypePickerProps = {
  category: string;
  problemType: string;
  onCategoryChange: (value: string) => void;
  onProblemTypeChange: (value: string) => void;
};

export default function ProblemTypePicker({
  category,
  problemType,
  onCategoryChange,
  onProblemTypeChange,
}: ProblemTypePickerProps) {
  const selectedCategory = problemCategories.find((item) => item.value === category);
  const availableTypes = selectedCategory?.options ?? [];

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
    onProblemTypeChange("");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
          Categoría <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <select
            id="category"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Selecciona una categoría</option>
            {problemCategories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-slate-500" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="problemType" className="block text-sm font-medium text-slate-700">
          Tipo de problema <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <select
            id="problemType"
            value={problemType}
            onChange={(e) => onProblemTypeChange(e.target.value)}
            disabled={!category}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">
              {category ? "Selecciona un tipo de problema" : "Primero elige una categoría"}
            </option>

            {availableTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-slate-500" />
        </div>
      </div>
    </div>
  );
}