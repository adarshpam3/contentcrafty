
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ArticleSearch } from "@/components/articles/ArticleSearch";
import { ArticleList } from "@/components/articles/ArticleList";
import { CategoriesContent } from "@/components/articles/CategoriesContent";

export default function Articles() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, projects(name)")
        .eq('is_category', false)
        .order("created_at", { ascending: sortDirection === "asc" });

      if (error) throw error;
      return data;
    },
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq('is_category', true)
        .order("created_at", { ascending: sortDirection === "asc" });

      if (error) throw error;
      return data;
    },
  });

  const filteredArticles = articles?.filter((article) =>
    article.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories?.filter((category) =>
    category.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Content Library
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage your articles and categories
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm px-4 py-2 bg-[#e6f4ea] text-[#06962c] rounded-full font-medium">
                  {articles?.length || 0} Articles
                </div>
                <Button 
                  variant="outline" 
                  className="border-[#06962c] text-[#06962c] hover:bg-[#e6f4ea]"
                >
                  Upgrade Plan
                </Button>
                <Button 
                  className="bg-[#06962c] hover:bg-[#057a24] text-white"
                  onClick={() => navigate('/create-content')}
                >
                  Create Content
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="w-full max-w-[400px] bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="articles"
                  className="w-full rounded-md data-[state=active]:bg-white data-[state=active]:text-[#06962c] data-[state=active]:shadow-sm"
                >
                  Articles
                </TabsTrigger>
                <TabsTrigger 
                  value="categories"
                  className="w-full rounded-md data-[state=active]:bg-white data-[state=active]:text-[#06962c] data-[state=active]:shadow-sm"
                >
                  Categories
                </TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="mt-6">
                <ArticleSearch 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSortToggle={toggleSort}
                />

                <div className="mt-6">
                  <ArticleList 
                    articles={filteredArticles || []}
                    isLoading={articlesLoading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="categories" className="mt-6">
                <CategoriesContent 
                  categories={filteredCategories || []}
                  isLoading={categoriesLoading}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
