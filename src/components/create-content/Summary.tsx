
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SummaryProps {
  categories: number;
  selectedLanguage: string;
  onBack?: () => void;
  onNext?: () => void;
  disableNext?: boolean;
}

export function Summary({ 
  categories, 
  selectedLanguage,
  onBack,
  onNext,
  disableNext
}: SummaryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Articles:</span>
          <span className="text-gray-900">{categories}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Language:</span>
          <span className="text-gray-900">{selectedLanguage || "not selected"}</span>
        </div>
        {(onBack || onNext) && (
          <div className="flex flex-col gap-2 mt-8">
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                className="w-full"
              >
                Back
              </Button>
            )}
            {onNext && (
              <Button
                onClick={onNext}
                className="w-full"
                disabled={disableNext}
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
