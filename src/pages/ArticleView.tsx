import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

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
        <div className="mb-4 text-sm text-gray-500 flex items-center gap-4">
          <span>Words: {article.word_count || 0}</span>
          <span>•</span>
          <span>Characters: {article.character_count || 0}</span>
          <span>•</span>
          <span>Language: {article.language}</span>
          <span>•</span>
          <span>Status: 
            <span className={`ml-1 px-2 py-1 rounded-full ${
              article.status === 'completed' 
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {article.status}
            </span>
          </span>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="prose max-w-none">
            <ReactMarkdown>{article.content || ''}</ReactMarkdown>
          </TabsContent>
          <TabsContent value="markdown">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{article.content}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}