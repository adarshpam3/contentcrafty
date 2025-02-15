
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticlesTab } from "@/components/projects/ArticlesTab";
import { CategoriesTab } from "@/components/projects/CategoriesTab";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: allContent = [], isLoading } = useQuery({
    queryKey: ["project-content", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("project_id", projectId);

      if (error) {
        toast({
          title: "Error loading content",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    },
    enabled: !!projectId,
  });

  // Filter content based on is_category flag
  const articles = allContent.filter(item => !item.is_category);
  const categories = allContent.filter(item => item.is_category);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-gray-900">Projects</Link>
          <span>/</span>
          <span className="text-gray-900">{project?.name}</span>
        </nav>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold">{project?.name}</h1>
              <p className="text-gray-500 mt-1">
                In this view, you can preview and edit articles assigned to the {project?.name} project.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Upgrade Plan</Button>
              <Button 
                onClick={() => navigate("/create-page")}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Create Content
              </Button>
            </div>
          </div>

          <Tabs defaultValue="articles">
            <TabsList>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="articles">
              <ArticlesTab articles={articles} />
            </TabsContent>

            <TabsContent value="categories">
              <CategoriesTab categories={categories} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
