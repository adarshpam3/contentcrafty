
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  disableNext: boolean;
}

export function NavigationButtons({ onBack, onNext, disableNext }: NavigationButtonsProps) {
  return (
    <div className="flex justify-end space-x-4 mt-8">
      <Button
        variant="outline"
        onClick={onBack}
        className="px-6"
      >
        Back
      </Button>
      <Button
        onClick={onNext}
        className="px-6 bg-[#06962c] hover:bg-[#057a24] text-white"
        disabled={disableNext}
      >
        Next
      </Button>
    </div>
  );
}
