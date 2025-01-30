import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, MoreVertical } from "lucide-react";

export default function ProjectView() {
  const { projectId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data: articles, isLoading } = useQuery({
    queryKey: ["project-articles", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_content")
        .select("*")
        .eq("page_url", decodeURIComponent(projectId || ""))
        .order("created_at", { ascending: sortDirection === "asc" });

      if (error) throw error;
      return data;
    },
  });

  const filteredArticles = articles?.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span>/</span>
            <a href="/projects" className="hover:text-gray-900">Projects</a>
            <span>/</span>
            <span className="text-gray-900">{projectId}</span>
          </nav>
          <h1 className="text-2xl font-semibold">{projectId}</h1>
          <p className="text-gray-600 mt-1">
            In this view, you can preview and edit articles assigned to the {projectId} project.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="text-red-500">Delete Selected</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <Tabs defaultValue="articles">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search by article title..."
              className="max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline" onClick={toggleSort}>
              Order By <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Input type="checkbox" className="w-4 h-4" />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Words</TableHead>
                  <TableHead>Characters</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredArticles?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No articles found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles?.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <Input type="checkbox" className="w-4 h-4" />
                      </TableCell>
                      <TableCell>{article.title}</TableCell>
                      <TableCell>
                        {article.description?.split(" ").length || 0}
                      </TableCell>
                      <TableCell>
                        {article.description?.length || 0}
                      </TableCell>
                      <TableCell>
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                          completed
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-500">✕</span>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="text-center p-8 text-gray-500">
            Categories feature coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}