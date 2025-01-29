import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Coins } from "lucide-react";

interface SummaryProps {
  selectedProject: string;
  selectedLanguage: string;
  topicsCount: number;
  imageCount: number;
}

export function Summary({ selectedProject, selectedLanguage, topicsCount, imageCount }: SummaryProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Token Display */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium">Tokens Available:</span>
          <span className="text-sm font-bold text-purple-600">1000</span>
        </div>
        <Button 
          variant="outline" 
          className="text-purple-600 border-purple-600 hover:bg-purple-50"
          onClick={() => navigate('/upgrade')}
        >
          Upgrade Plan
        </Button>
      </div>

      {/* Summary Card */}
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
    </div>
  );
}