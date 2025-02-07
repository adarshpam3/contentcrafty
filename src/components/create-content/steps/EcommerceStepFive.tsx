
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Topic } from "@/types/ecommerce";

interface EcommerceStepFiveProps {
  topics: Topic[];
  selectedProject: string;
  selectedLanguage: string;
}

export function EcommerceStepFive({ topics, selectedProject, selectedLanguage }: EcommerceStepFiveProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(true);

  useEffect(() => {
    const createArticles = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error('User not authenticated');
        }

        // Create articles for each topic
        for (const topic of topics) {
          const { error: articleError } = await supabase
            .from("articles")
            .insert({
              topic: topic.title,
              content: '', // Will be filled later when content is generated
              language: selectedLanguage,
              project_id: selectedProject,
              user_id: userData.user.id,
              status: "pending",
              h2_headings: topic.h2Headings,
              has_faq: topic.options.faq,
              has_toc: topic.options.tableOfContents,
              has_image: topic.options.generateImage,
            });

          if (articleError) throw articleError;
        }

        setIsCreating(false);
        toast({
          title: "Success",
          description: "Your categories have been created successfully.",
        });
      } catch (error: any) {
        console.error("Error creating articles:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to create articles",
          variant: "destructive",
        });
        setIsCreating(false);
      }
    };

    if (isCreating) {
      createArticles();
    }
  }, [topics, selectedProject, selectedLanguage, toast]);

  if (isCreating) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Well done mate!</h2>
          <p className="text-gray-500 text-center">
            Your content is being created. It will take a few minutes<br />
            depending on the amount of text to write.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-semibold mb-2">Well done mate!</h2>
            <p className="text-gray-500 text-center mb-8">
              Your content is being created. It will take a few minutes<br />
              depending on the amount of text to write.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/projects')}
                className="bg-gray-100 hover:bg-gray-200"
              >
                Go to projects
              </Button>
              <Button
                onClick={() => navigate('/create-ecommerce-content')}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Write more content
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Articles:</span>
              <span className="text-gray-900">{topics.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Language:</span>
              <span className="text-gray-900 capitalize">{selectedLanguage}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
