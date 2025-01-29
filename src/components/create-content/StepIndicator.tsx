import { cn } from "@/lib/utils";

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
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                currentStep === step.number
                  ? "bg-purple-600 text-white"
                  : currentStep > step.number
                  ? "bg-purple-200 text-purple-700"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {step.number}
            </div>
            <div className="mt-2 text-sm font-medium text-gray-900">
              {step.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}