
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleContent } from "@/components/article/ArticleContent";
import { ArticleSidebar } from "@/components/article/ArticleSidebar";

export default function ArticleView() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, projects(name, content_type)")
        .eq("id", articleId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Article not found",
          description: "The requested article does not exist",
          variant: "destructive",
        });
        navigate("/articles");
        return null;
      }

      setContent(data.content || "");
      return data;
    },
  });

  const handleSave = async () => {
    const { error } = await supabase
      .from("articles")
      .update({ content })
      .eq("id", articleId);

    if (error) {
      toast({
        title: "Error saving article",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Article saved",
      description: "Your changes have been saved successfully",
    });
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-images', {
        body: { prompt: article?.topic || '' }
      });

      if (error) throw error;

      if (!data?.data?.[0]?.url) {
        throw new Error('Failed to generate image');
      }

      const { error: updateError } = await supabase
        .from("articles")
        .update({ featured_image: data.data[0].url })
        .eq("id", articleId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Featured image generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error generating image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#06962c]" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <p className="text-red-500">{error ? `Error loading article: ${error.message}` : 'Article not found'}</p>
        <Button onClick={() => navigate("/articles")} variant="outline">
          Return to Articles
        </Button>
      </div>
    );
  }

  const isHtmlContent = article.projects?.content_type === 'fast_writer';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <ArticleHeader projectName={article.projects?.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ArticleContent
              topic={article.topic}
              content={content}
              onContentChange={setContent}
              onSave={handleSave}
              isHtmlContent={isHtmlContent}
            />
          </div>

          <div className="lg:col-span-1">
            <ArticleSidebar
              imageUrl={article.featured_image}
              isGenerating={isGeneratingImage}
              onGenerateImage={handleGenerateImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
