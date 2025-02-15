
import { StepIndicator } from "./StepIndicator";

const steps = [
  { number: 1, title: "Select Project", current: true },
  { number: 2, title: "Select language", current: false },
  { number: 3, title: "Add topics", current: false },
  { number: 4, title: "Review", current: false },
  { number: 5, title: "Done", current: false },
];

interface CreateContentStepsProps {
  currentStep: number;
}

export function CreateContentSteps({ currentStep }: CreateContentStepsProps) {
  return <StepIndicator steps={steps} currentStep={currentStep} />;
}
