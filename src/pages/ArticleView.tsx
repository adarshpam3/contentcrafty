"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Bold, Italic, Strikethrough, AlignLeft, AlignCenter, AlignRight, Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function EditArticle() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [content, setContent] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{ url: string; fileName: string } | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch article data
  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, projects(name)")
        .eq("id", articleId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Sync fetched content to state
  useEffect(() => {
    if (article) {
      setContent(article.content || "");
    }
  }, [articleId, article]);

  // Insert markdown syntax at cursor position
  const insertText = (before: string, after = "") => {
    if (!textAreaRef.current) return;
    const textarea = textAreaRef.current;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Generate image
  const generateImage = async () => {
    if (!article?.topic) {
      toast({
        title: "Error",
        description: "No topic available for image generation",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-images', {
        body: { prompt: article.topic }
      });

      if (error) throw new Error(error.message);
      if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('Invalid response format from image generation');
      }

      const generatedImageData = {
        url: data.data[0].url,
        fileName: data.data[0].fileName
      };

      setGeneratedImage(generatedImageData);

      // Update the article with the new image URL
      const { error: updateError } = await supabase
        .from("articles")
        .update({ featured_image: generatedImageData.url })
        .eq("id", articleId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Image generated and saved successfully!",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Download generated image
  const handleDownload = async () => {
    if (!generatedImage?.url) return;

    try {
      const response = await fetch(generatedImage.url);
      if (!response.ok) throw new Error('Failed to fetch image');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generatedImage.fileName || 'generated-image.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Image downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  // Save changes
  const handleSave = async () => {
    if (article?.content === content) {
      toast({
        title: "No changes",
        description: "No modifications detected",
        variant: "default",
      });
      return;
    }

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

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-10" />;
  if (error) return <p className="text-red-500 text-center">Error loading article</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{article?.title || "Edit Article"}</h1>

      {/* Featured Image Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Featured Image</h2>
        <div className="space-y-4">
          {article?.featured_image && (
            <div className="aspect-video relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={article.featured_image}
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={generateImage}
              disabled={isGeneratingImage}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate New Image"
              )}
            </Button>
            {generatedImage && (
              <Button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="edit">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <div className="mb-2 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => insertText("**", "**")}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText("_", "_")}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText("~~", "~~")}>
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText('<div style="text-align:left;">', "</div>")}>
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText('<div style="text-align:center;">', "</div>")}>
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText('<div style="text-align:right;">', "</div>")}>
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <textarea
            ref={textAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 border rounded-lg p-2"
            placeholder="Write your article..."
          />
        </TabsContent>

        <TabsContent value="preview">
          <div className="p-4 border rounded-lg">
            <ReactMarkdown>{content || "_Nothing to preview_"}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="mt-4">
        Save
      </Button>
    </div>
  );
}
