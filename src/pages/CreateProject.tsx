import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function CreateProject() {
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
        return;
      }

      const { error } = await supabase
        .from('seo_content')
        .insert([
          { 
            page_url: projectName,
            title: projectName,
            user_id: user.id
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

      // Wait a brief moment for the toast to be visible before navigating
      setTimeout(() => {
        navigate("/projects");
      }, 500);

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
    <div className="p-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-gray-900">Home</a>
        <span>/</span>
        <a href="/projects" className="hover:text-gray-900">Projects</a>
        <span>/</span>
        <span className="text-gray-900">Create new</span>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-2">Add new project</h1>
        <p className="text-gray-600 mb-8">You can add new project here.</p>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">Create project</h2>
          
          <form onSubmit={handleSubmit}>
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
        </div>
      </div>
    </div>
  );
}