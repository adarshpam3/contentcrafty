import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function ArticleView() {
  const { articleId } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, projects(name)")
        .eq("id", articleId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Article not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-gray-900">Projects</Link>
          <span>/</span>
          <Link 
            to={`/projects/${article.project_id}`} 
            className="hover:text-gray-900"
          >
            {article.projects?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{article.topic}</span>
        </nav>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">{article.topic}</h1>
          <div className="mb-4 text-sm text-gray-500">
            <span>Word count: {article.word_count || 0}</span>
            <span className="mx-2">•</span>
            <span>Character count: {article.character_count || 0}</span>
          </div>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="prose max-w-none mt-4">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </TabsContent>
            <TabsContent value="html" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{article.content}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}