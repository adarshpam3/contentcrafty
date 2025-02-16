
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectStats } from "@/components/projects/ProjectStats";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { ProjectDialogs } from "@/components/projects/ProjectDialogs";

export default function Projects() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToRename, setProjectToRename] = useState<{ id: string; name: string } | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*, articles(count)")
        .order("created_at", { ascending: false });

      if (projectsError) {
        toast({
          title: "Error loading projects",
          description: projectsError.message,
          variant: "destructive",
        });
        return [];
      }

      return projectsData || [];
    },
  });

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProjectToDelete(null);
    }
  };

  const handleRename = async () => {
    if (!projectToRename || !newProjectName.trim()) return;

    try {
      const { error } = await supabase
        .from("projects")
        .update({ name: newProjectName.trim() })
        .eq("id", projectToRename.id);

      if (error) throw error;

      // Clear states before invalidating query
      const tempToastMessage = "Project renamed successfully";
      setProjectToRename(null);
      setNewProjectName("");

      // Invalidate and refetch in the background
      queryClient.invalidateQueries({ 
        queryKey: ["projects"],
        exact: true 
      });

      // Show toast after state updates
      toast({
        title: "Success",
        description: tempToastMessage,
      });
    } catch (error: any) {
      toast({
        title: "Error renaming project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects?.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalArticles = projects?.reduce((sum, project) => sum + (project.articles?.[0]?.count || 0), 0) || 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <ProjectHeader />
            <ProjectStats 
              totalProjects={projects?.length || 0} 
              totalArticles={totalArticles} 
            />
          </div>

          {/* Search and Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <Input
                placeholder="Search projects..."
                className="max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading projects...</div>
            ) : (
              <div className="overflow-x-auto">
                <ProjectTable
                  projects={filteredProjects || []}
                  onDelete={setProjectToDelete}
                  onRename={(project) => {
                    setProjectToRename(project);
                    setNewProjectName(project.name);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <ProjectDialogs
          projectToDelete={projectToDelete}
          projectToRename={projectToRename}
          newProjectName={newProjectName}
          onDeleteCancel={() => setProjectToDelete(null)}
          onDeleteConfirm={handleDelete}
          onRenameCancel={() => {
            setProjectToRename(null);
            setNewProjectName("");
          }}
          onRenameConfirm={handleRename}
          onNewNameChange={setNewProjectName}
        />
      </div>
    </div>
  );
}
