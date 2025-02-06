
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useContentCreation } from "../ContentCreationProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function StepFive() {
  const navigate = useNavigate();
  const { selectedProject, selectedLanguage, categories } = useContentCreation();
  const [isGenerating, setIsGenerating] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const createArticles = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error('User not authenticated');
        }

        // Create an article for each category
        for (const category of categories) {
          const { data: articleData, error: dbError } = await supabase
            .from("articles")
            .insert({
              topic: `${category.storeName} - ${category.categoryName}`,
              content: `Keywords: ${category.keywords}\n\nKey Features:\n${category.keyFeatures}`,
              language: selectedLanguage,
              project_id: selectedProject,
              user_id: userData.user.id,
              status: "completed",
            })
            .select()
            .single();

          if (dbError) throw dbError;
        }

        toast({
          title: "Success",
          description: "Your categories have been created successfully.",
        });

        // Navigate back to the project view
        navigate(`/projects/${selectedProject}`);
      } catch (error: any) {
        console.error("Error creating articles:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to create articles. Please try again.",
          variant: "destructive",
        });
        setIsGenerating(false);
      }
    };

    if (isGenerating) {
      createArticles();
    }
  }, [categories, selectedLanguage, selectedProject, navigate, toast]);

  if (isGenerating) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Creating your categories...</h2>
          <p className="text-gray-500">This may take a few moments</p>
        </div>
      </Card>
    );
  }

  return null;
}
