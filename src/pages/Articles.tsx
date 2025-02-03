import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

export default function Articles() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, projects(name)")
        .order("created_at", { ascending: sortDirection === "asc" });

      if (error) throw error;
      return data;
    },
  });

  const filteredArticles = articles?.filter((article) =>
    article.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click when deleting
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      console.error("Error deleting article:", error);
    }
  };

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-2">List of articles & categories</h1>
              <p className="text-gray-600">
                List of all your articles & categories generated by Copymate.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {articles?.length || 0} Articles left (3 tokens)
              </div>
              <Button variant="outline">Upgrade Plan</Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => navigate('/create-page')}
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

            <TabsContent value="articles" className="mt-6">
              <div className="flex justify-between mb-4">
                <Input
                  placeholder="Search by project or title..."
                  className="max-w-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" onClick={toggleSort}>
                  Order By <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Project</th>
                      <th className="text-left p-4 font-medium">Title</th>
                      <th className="text-left p-4 font-medium">Words</th>
                      <th className="text-left p-4 font-medium">Characters</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center p-4">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredArticles?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center p-4">
                          No articles found
                        </td>
                      </tr>
                    ) : (
                      filteredArticles?.map((article) => (
                        <tr 
                          key={article.id} 
                          className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/articles/${article.id}`)}
                        >
                          <td className="p-4">
                            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                              {article.projects?.name || 'No Project'}
                            </span>
                          </td>
                          <td className="p-4 text-gray-900">
                            {article.topic}
                          </td>
                          <td className="p-4 text-gray-600">{article.word_count || 0}</td>
                          <td className="p-4 text-gray-600">{article.character_count || 0}</td>
                          <td className="p-4">
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                              {article.status || 'pending'}
                            </span>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              className="text-red-500 hover:text-red-700"
                              onClick={(e) => handleDelete(e, article.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="text-center p-8 text-gray-500">
                Categories feature coming soon
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}