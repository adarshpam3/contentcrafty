import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function CreateProjectForm() {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName) {
      toast({
        title: "Error",
        description: "Please enter a project name",
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
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('seo_content')
        .insert([
          { 
            page_url: projectName,
            title: projectName,
            user_id: user.id,
            description: null,
            keywords: [],
            meta_tags: {}
          }
        ]);

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      // Navigate after a brief delay to ensure the toast is visible
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
      <div className="mb-6">
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
          Project name
        </label>
        <Input
          id="projectName"
          type="text"
          placeholder="www.copymate.app"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

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