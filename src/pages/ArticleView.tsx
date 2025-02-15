
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
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
  Undo,
  Redo,
  Download,
  ImagePlus,
  Sparkles,
  Share2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
                  <span className="text-[#06962c]">Model: {article.model || 'copy-mate-003'}</span>
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

                <div className="border rounded-lg mb-4">
                  <div className="flex flex-wrap items-center gap-2 p-2 border-b">
                    <Select defaultValue="default">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="arial">Arial</SelectItem>
                        <SelectItem value="times">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="16">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="14">14</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="18">18</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex flex-wrap gap-1 ml-2">
                      {formatButtons.map((button) => (
                        <Button
                          key={button.label}
                          variant="ghost"
                          size="sm"
                          className="p-2 h-8 hover:bg-[#e6f4ea] hover:text-[#06962c]"
                          title={button.label}
                          onClick={button.action}
                        >
                          <button.icon className="h-4 w-4" />
                        </Button>
                      ))}
                      <div className="border-l border-gray-200 mx-2" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 hover:bg-[#e6f4ea] hover:text-[#06962c]"
                        title="Undo"
                        onClick={() => document.execCommand('undo')}
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 hover:bg-[#e6f4ea] hover:text-[#06962c]"
                        title="Redo"
                        onClick={() => document.execCommand('redo')}
                      >
                        <Redo className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <TabsContent value="edit">
                  <textarea
                    className="w-full min-h-[500px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06962c] text-gray-800"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="preview" className="prose max-w-none">
                  <div className="p-4 border rounded-lg min-h-[500px]">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-medium mb-4 text-gray-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Featured Image
              </h3>
              
              {article.featured_image ? (
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={article.featured_image}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <ImagePlus className="w-4 h-4 mr-2" />
                      )}
                      New
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-4">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      No featured image yet
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-[#06962c] hover:bg-[#057a24]"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate with AI
                  </Button>
                </div>
              )}

              <div className="mt-8">
                <h3 className="font-medium mb-4 text-gray-800">Article Status</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      className="w-4 h-4 text-[#06962c] border-gray-300 focus:ring-[#06962c]" 
                      name="status" 
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-600">Used</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      className="w-4 h-4 text-[#06962c] border-gray-300 focus:ring-[#06962c]" 
                      name="status" 
                    />
                    <span className="ml-2 text-sm text-gray-600">Unused</span>
                  </label>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-4 text-gray-800">Notes</h3>
                <textarea
                  className="w-full h-32 p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#06962c] placeholder-gray-400"
                  placeholder="Add notes about this article..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
