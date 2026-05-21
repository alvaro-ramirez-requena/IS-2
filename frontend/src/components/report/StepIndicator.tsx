type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
                isActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : isCompleted
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-slate-300 bg-white text-slate-500",
              ].join(" ")}
            >
              {stepNumber}
            </div>

            <span
              className={[
                "text-sm font-medium",
                isActive || isCompleted ? "text-slate-900" : "text-slate-500",
              ].join(" ")}
            >
              {step}
            </span>

            {index < steps.length - 1 && <div className="h-px w-8 bg-slate-300" />}
          </div>
        );
      })}
    </div>
  );
}