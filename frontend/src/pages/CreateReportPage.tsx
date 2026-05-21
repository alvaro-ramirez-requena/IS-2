import { useState } from "react";

import ReportHeader from "../components/report/ReportHeader";
import StepIndicator from "../components/report/StepIndicator";
import ProblemTypePicker from "../components/report/ProblemTypePicker";
import ProblemDescription from "../components/report/ProblemDescription";
import AnonymousToggle from "../components/report/AnonymousToggle";
import Button from "../components/ui/Button";

export default function CreateReportPage() {
  const [category, setCategory] = useState("");
  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  const steps = ["Información", "Ubicación", "Evidencia", "Confirmar"];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      category,
      problemType,
      description,
      anonymous,
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <ReportHeader
            title="Crear nuevo reporte"
            description="Registra una incidencia con tipo de problema, descripción y opción de anonimato."
          />

          <div className="mt-6">
            <StepIndicator steps={steps} currentStep={1} />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <ProblemTypePicker
              category={category}
              problemType={problemType}
              onCategoryChange={setCategory}
              onProblemTypeChange={setProblemType}
            />

            <ProblemDescription
              value={description}
              onChange={setDescription}
              maxLength={500}
            />

            <AnonymousToggle
              enabled={anonymous}
              onToggle={setAnonymous}
            />

            <div className="pt-2">
              <Button type="submit">
                Siguiente
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}