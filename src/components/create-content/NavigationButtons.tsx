import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NavigationButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between mt-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="px-6"
      >
        Back
      </Button>
      <Button 
        className="bg-purple-600 hover:bg-purple-700 text-white px-6"
        onClick={() => {/* Handle create content */}}
      >
        Create Content
      </Button>
    </div>
  );
}
