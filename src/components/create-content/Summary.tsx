import { Card } from "@/components/ui/card";

interface SummaryProps {
  selectedProject: string;
  selectedLanguage: string;
  topicsCount: number;
  imageCount: number;
}

export function Summary({ selectedProject, selectedLanguage, topicsCount, imageCount }: SummaryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Project:</span>
          <span className="text-gray-900">{selectedProject || "not selected"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Articles to write:</span>
          <span className="text-gray-900">{topicsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Image cost:</span>
          <span className="text-gray-900">{imageCount} Tokens</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Language:</span>
          <span className="text-gray-900">{selectedLanguage || "not selected"}</span>
        </div>
      </div>
    </Card>
  );
}