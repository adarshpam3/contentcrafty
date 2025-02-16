import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Add this import
import {
  Loader2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Table,
  Image as ImageIcon,
  Code,
  Quote,
  Share2
} from "lucide-react";
import { EditorToolbar } from "@/components/article/EditorToolbar";
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
        .select("*, projects(name)")
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

  const insertText = (before: string, after = "") => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

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
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, label: "Bold", action: () => insertText("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertText("*", "*") },
    { icon: Underline, label: "Underline", action: () => insertText("__", "__") },
    { icon: Strikethrough, label: "Strike", action: () => insertText("~~", "~~") },
    { icon: LinkIcon, label: "Link", action: () => insertText("[", "](url)") },
    { icon: AlignLeft, label: "Align Left", action: () => {} },
    { icon: AlignCenter, label: "Align Center", action: () => {} },
    { icon: AlignRight, label: "Align Right", action: () => {} },
    { icon: List, label: "Bullet List", action: () => insertText("- ") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertText("1. ") },
    { icon: Table, label: "Table", action: () => insertText("\n| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n") },
    { icon: ImageIcon, label: "Image", action: () => insertText("![Alt text](", ")") },
    { icon: Code, label: "Code", action: () => insertText("`", "`") },
    { icon: Quote, label: "Quote", action: () => insertText("> ") },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-2 text-gray-800">Edit article</h1>
              <p className="text-gray-500">Project: {article.projects?.name}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/articles")}
              className="text-gray-600"
            >
              Back to Articles
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-medium mb-4 flex items-center gap-2 text-gray-800">
                  {article.topic}
                  <span className="text-[#06962c] text-sm font-normal cursor-pointer hover:underline">↗ edit title</span>
                </h2>
                <div className="flex gap-4 text-sm bg-[#e6f4ea] p-2 rounded-lg">
                  <span className="text-[#06962c]">AI Assistant</span>
                  <span>Words: {content.split(/\s+/).length}</span>
                  <span>Characters: {content.length}</span>
                </div>
              </div>

              <Tabs defaultValue="edit" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "Link copied",
                          description: "Share link has been copied to clipboard",
                        });
                      }}
                      className="text-gray-600"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="bg-[#06962c] hover:bg-[#057a24]"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>

                <EditorToolbar formatButtons={formatButtons} />

                <TabsContent value="edit">
                  <textarea
                    className="w-full min-h-[500px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06962c] text-gray-800"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="preview" className="prose max-w-none">
                  <div className="p-4 border rounded-lg min-h-[500px]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
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
