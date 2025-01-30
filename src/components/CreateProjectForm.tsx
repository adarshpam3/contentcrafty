import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProjectNameInput } from "./project/ProjectNameInput";
import { validateProjectName } from "@/utils/form-validation";
import { createProject } from "@/services/project-service";

export function CreateProjectForm() {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateProjectName(projectName);
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a project",
          variant: "destructive",
        });
        return;
      }

      await createProject(projectName, user.id);

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      setTimeout(() => {
        navigate("/projects");
      }, 1000);

    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProjectNameInput
        value={projectName}
        onChange={setProjectName}
        disabled={isLoading}
      />

      <Button 
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create project"}
      </Button>
    </form>
  );
}