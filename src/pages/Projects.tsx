import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, X, Plus, TrendingUp, FileText, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Projects() {
  const navigate = useNavigate();
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

      toast({
        title: "Success",
        description: "Project renamed successfully",
      });

      setProjectToRename(null);
      setNewProjectName("");
      queryClient.invalidateQueries({ queryKey: ["projects"] });

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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#e6f4ea] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#06962c] rounded-lg p-2">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#06962c]">Total Projects</p>
                    <p className="text-2xl font-semibold text-[#06962c]">{projects?.length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 rounded-lg p-2">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Total Articles</p>
                    <p className="text-2xl font-semibold text-blue-600">{totalArticles}</p>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 rounded-lg p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">Active Projects</p>
                    <p className="text-2xl font-semibold text-emerald-600">{projects?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Project Name</TableHead>
                      <TableHead className="font-semibold">Unpublished Articles</TableHead>
                      <TableHead className="font-semibold">Wordpress</TableHead>
                      <TableHead className="font-semibold">PBN</TableHead>
                      <TableHead className="font-semibold w-[100px]">Delete</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects?.map((project) => (
                      <TableRow 
                        key={project.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <TableCell onClick={() => navigate(`/projects/${project.id}`)}>
                          <span className="text-[#06962c] hover:underline font-medium">
                            {project.name}
                          </span>
                        </TableCell>
                        <TableCell onClick={() => navigate(`/projects/${project.id}`)}>{project.articles?.[0]?.count || 0}</TableCell>
                        <TableCell onClick={() => navigate(`/projects/${project.id}`)}>
                          <X className="text-red-500 h-5 w-5" />
                        </TableCell>
                        <TableCell onClick={() => navigate(`/projects/${project.id}`)}>
                          <X className="text-red-500 h-5 w-5" />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToDelete(project.id);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setProjectToRename({ id: project.id, name: project.name });
                                  setNewProjectName(project.name);
                                }}
                              >
                                Rename
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the project and all its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Rename Dialog */}
        <Dialog 
          open={!!projectToRename} 
          onOpenChange={(open) => {
            if (!open) {
              setProjectToRename(null);
              setNewProjectName("");
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Project</DialogTitle>
              <DialogDescription>
                Enter a new name for your project below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter new project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setProjectToRename(null);
                  setNewProjectName("");
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRename}
                className="bg-[#06962c] hover:bg-[#057a24] text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
