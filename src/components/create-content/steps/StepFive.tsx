import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useContentCreation } from "../ContentCreationProvider";
import { ArticleEditor } from "../ArticleEditor";
import { supabase } from "@/integrations/supabase/client";

export function StepFive() {
  const { topics, selectedProject, selectedLanguage } = useContentCreation();
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const generateArticle = async () => {
      if (!topics[currentTopicIndex]) return;

      try {
        const response = await fetch('/api/generate-article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topics[currentTopicIndex].title,
            language: selectedLanguage,
          }),
        });

        if (!response.ok) throw new Error('Failed to generate article');

        const data = await response.json();
        setGeneratedContent(data.content);
        setWordCount(data.wordCount);
        setCharacterCount(data.characterCount);

        // Save to Supabase
        const { error } = await supabase
          .from('articles')
          .insert({
            topic: topics[currentTopicIndex].title,
            content: data.content,
            language: selectedLanguage,
            project_id: selectedProject,
            word_count: data.wordCount,
            character_count: data.characterCount,
            status: 'completed',
          });

        if (error) throw error;

        toast({
          title: "Article generated",
          description: "Your article has been generated successfully.",
        });
      } catch (error) {
        console.error('Error generating article:', error);
        toast({
          title: "Error",
          description: "Failed to generate article. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    };

    if (isGenerating) {
      generateArticle();
    }
  }, [currentTopicIndex, topics, selectedLanguage, selectedProject]);

  if (isGenerating) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Generating your article...</h2>
          <p className="text-gray-500">This may take a few moments</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {topics[currentTopicIndex]?.title}
      </h2>
      <ArticleEditor
        content={generatedContent}
        wordCount={wordCount}
        characterCount={characterCount}
        onSave={() => {
          toast({
            title: "Article saved",
            description: "Your article has been saved successfully.",
          });
          if (currentTopicIndex < topics.length - 1) {
            setCurrentTopicIndex(prev => prev + 1);
            setIsGenerating(true);
          }
        }}
      />
    </Card>
  );
}