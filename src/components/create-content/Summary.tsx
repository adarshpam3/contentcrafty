
import { Card } from "@/components/ui/card";

interface SummaryProps {
  categories: number;
  selectedLanguage: string;
  children?: React.ReactNode;
}

export function Summary({ categories, selectedLanguage, children }: SummaryProps) {
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
          <span className="text-gray-900">{selectedLanguage || "auto"}</span>
        </div>
      </div>
      {children}
    </Card>
  );
}
