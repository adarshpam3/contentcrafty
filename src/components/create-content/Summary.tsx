
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SummaryProps {
  selectedProject: string;
  selectedLanguage: string;
  topicsCount: number;
  imageCount: number;
}

export function Summary({ selectedLanguage, topicsCount }: SummaryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Articles:</span>
          <span className="text-gray-900">{topicsCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Language:</span>
          <span className="text-gray-900">{selectedLanguage || "not selected"}</span>
        </div>
      </div>
      
      <div className="flex gap-3 mt-8">
        <Button variant="outline" className="w-full">
          Back
        </Button>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          Create Content
        </Button>
      </div>
    </Card>
  );
}
