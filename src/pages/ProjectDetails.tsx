import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

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

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["project-content", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_content")
        .select("*")
        .eq("page_url", project?.name);

      if (error) throw error;
      return data || [];
    },
    enabled: !!project?.name,
  });

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
          </Tabs>

          {content.length === 0 ? (
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <p className="text-purple-700 mb-4">
                You don't have any articles assigned to this project yet. Use one of our models and start creating outstanding content!
              </p>
              <Button 
                onClick={() => navigate("/create-page")}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Create Content
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <Input
                  placeholder="Search by article title..."
                  className="max-w-sm"
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="text-red-500">Delete Selected</Button>
                  <Button variant="outline">Export</Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Words</TableHead>
                      <TableHead>Characters</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {content.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <input type="checkbox" className="rounded border-gray-300" />
                        </TableCell>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{article.description?.split(" ").length || 0}</TableCell>
                        <TableCell>{article.description?.length || 0}</TableCell>
                        <TableCell>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                            completed
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-red-500">×</span>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}