
interface Step {
  number: number;
  title: string;
  current: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between relative">
        {/* Connecting lines */}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              backgroundColor: '#06962c'
            }}
          />
        </div>

        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                ${currentStep === step.number
                  ? "text-white scale-110"
                  : currentStep > step.number
                  ? "bg-[#b8e6c4] text-[#06962c]"
                  : "bg-gray-200 text-gray-500"
                }`}
              style={{
                backgroundColor: currentStep === step.number ? '#06962c' : undefined
              }}
            >
              {step.number}
            </div>
            <div className="mt-2 text-sm font-medium text-gray-900">{step.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
