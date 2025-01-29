import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NavigationButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-3 mt-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="px-8 border-purple-200 text-purple-600 hover:bg-purple-50"
      >
        Back
      </Button>
      <Button 
        onClick={() => {/* Handle next step */}}
        className="px-8 bg-purple-600 hover:bg-purple-700 text-white"
      >
        Next
      </Button>
    </div>
  );
}