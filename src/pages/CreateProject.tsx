
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";

export default function CreateProject() {
  const [projectUrl, setProjectUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectUrl.trim()) {
      toast({
        title: "Error",
        description: "Project URL is required",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(projectUrl);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to create a project",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      const { error: projectError } = await supabase
        .from("projects")
        .insert([{ 
          name: projectUrl,
          url: projectUrl,
          user_id: session.user.id,
          type: "indexing_api"
        }]);

      if (projectError) {
        throw projectError;
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      });
      navigate("/projects");
      
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm mb-8">
            <span 
              className="text-purple-600 hover:underline cursor-pointer"
              onClick={() => navigate('/')}
            >
              Home
            </span>
            <span className="text-gray-500">/</span>
            <span 
              className="text-purple-600 hover:underline cursor-pointer"
              onClick={() => navigate('/indexing-api')}
            >
              Indexing API
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">Setup project</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <h1 className="text-4xl font-semibold">Indexing API Project</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <label htmlFor="projectUrl" className="block text-lg font-medium">
                  Project Name (Valid URL)
                </label>
                <Input
                  id="projectUrl"
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://copymate.app"
                  className="w-full text-base p-3"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-2 rounded-md"
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>

              {/* Info Message */}
              <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <p className="text-center text-purple-700">
                  The project name must be exactly the same as the URL address of the page added to Google Search Console.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
