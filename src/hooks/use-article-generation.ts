import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Topic {
  title: string;
  h2Headings: string[];
  options: {
    addH2: boolean;
    faq: boolean;
    tableOfContents: boolean;
    generateImage: boolean;
  };
}

export const useArticleGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateArticles = async (
    topics: Topic[],
    projectId: string,
    language: string,
    onSuccess: () => void
  ) => {
    try {
      setIsGenerating(true);
      toast({
        title: "Creating content",
        description: "Your content is being generated. Please wait...",
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to generate articles.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const response = await supabase.functions.invoke('generate-articles', {
        body: {
          topics,
          projectId,
          language,
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      onSuccess();
      toast({
        title: "Success",
        description: "Articles have been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating articles:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateArticles,
  };
};