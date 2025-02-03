import { useParams } from "react-router-dom";
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
        .select("*")
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
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">{article.topic}</h1>
        <div className="mb-4 text-sm text-gray-500">
          <span>Word count: {article.word_count}</span>
          <span className="mx-2">•</span>
          <span>Character count: {article.character_count}</span>
        </div>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </TabsContent>
          <TabsContent value="html">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{article.content}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}