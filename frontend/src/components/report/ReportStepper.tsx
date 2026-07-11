const steps = ["Información", "Ubicación", "Evidencia", "Confirmar"];

type Props = {
  currentStep: number;
};

export default function ReportStepper({ currentStep }: Props) {
  return (
    <div
      className="
      flex
      items-center
      justify-between
      mb-12
    "
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;

        const active = currentStep === stepNumber;

        return (
          <div
            key={step}
            className="
              flex
              items-center
              flex-1
            "
          >
            <div
              className="
              flex
              items-center
              gap-4
            "
            >
              <div
                className={`
                w-12
                h-12
                rounded-full
                flex
                items-center
                justify-center
                font-bold
                text-lg
                ${active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}
              `}
              >
                {stepNumber}
              </div>

              <span
                className={`
                text-lg
                font-medium
                ${active ? "text-black" : "text-gray-500"}
              `}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className="
                flex-1
                h-[2px]
                bg-gray-300
                mx-4
              "
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
