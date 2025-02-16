
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProjectHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Projects Overview</h1>
        <p className="text-gray-500 mt-1">
          Manage and organize your content projects
        </p>
      </div>
      <Button 
        onClick={() => navigate("/create-project")}
        className="bg-[#06962c] hover:bg-[#057a24] text-white flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
