
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["project-articles", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("project_id", projectId);

      if (error) {
        toast({
          title: "Error loading articles",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    },
    enabled: !!projectId,
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
                onClick={() => navigate("/create-content")}
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
              {articles.length === 0 ? (
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <p className="text-purple-700 mb-4">
                    You don't have any articles assigned to this project yet. Use one of our models and start creating outstanding content!
                  </p>
                  <Button 
                    onClick={() => navigate("/create-content")}
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
                        {articles.map((article) => (
                          <TableRow 
                            key={article.id}
                            className="cursor-pointer"
                            onClick={() => navigate(`/articles/${article.id}`)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" className="rounded border-gray-300" />
                            </TableCell>
                            <TableCell className="font-medium">{article.topic}</TableCell>
                            <TableCell>{article.word_count || 0}</TableCell>
                            <TableCell>{article.character_count || 0}</TableCell>
                            <TableCell>
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                                {article.status || 'completed'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-red-500">×</span>
                            </TableCell>
                            <TableCell>-</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
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
            </TabsContent>

            <TabsContent value="categories">
              {articles.filter(a => a.is_category).length === 0 ? (
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <p className="text-purple-700 mb-4">
                    You don't have any categories yet. Create your first category using our e-commerce model!
                  </p>
                  <Button 
                    onClick={() => navigate("/create-ecommerce-content")}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Create Category
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Input
                      placeholder="Search categories..."
                      className="max-w-sm"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigate("/create-ecommerce-content")}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Create Category
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <div className="grid grid-cols-4 gap-4 py-2 font-medium text-sm text-gray-500">
                      <div>Category</div>
                      <div>Store</div>
                      <div>Keywords</div>
                      <div>Key Features</div>
                    </div>
                    {articles.filter(a => a.is_category).map((category) => (
                      <div key={category.id} className="grid grid-cols-4 gap-4 py-3 border-t items-center">
                        <div className="text-purple-600">{category.topic}</div>
                        <div className="text-gray-600">-</div>
                        <div className="text-gray-600">-</div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 truncate">
                            {(category.h2_headings || []).join(", ").substring(0, 50)}...
                          </span>
                          <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 h-auto text-xs"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
