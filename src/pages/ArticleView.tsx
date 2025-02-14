
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, projects(name)")
        .eq("id", articleId)
        .single();

      if (error) throw error;
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Edit article</h1>
          <p className="text-gray-500">You can preview and edit your article here.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  {article.topic}
                  <span className="text-purple-600 text-sm font-normal cursor-pointer">↗ title</span>
                </h2>
                <div className="flex gap-4 text-sm">
                  <span className="text-purple-600">Model: copy-mate-003</span>
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
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied",
                        description: "Share link has been copied to clipboard",
                      });
                    }}>
                      Copy share link
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>

                <div className="border rounded-lg mb-4">
                  <div className="flex items-center gap-2 p-2 border-b">
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
                          className="p-2 h-8"
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
                        className="p-2 h-8"
                        title="Undo"
                        onClick={() => document.execCommand('undo')}
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8"
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
                    className="w-full min-h-[500px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="preview" className="prose max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="font-medium mb-4">Featured Image</h3>
              {article.featured_image ? (
                <img
                  src={article.featured_image}
                  alt="Featured"
                  className="w-full rounded-lg mb-4"
                />
              ) : (
                <div className="bg-gray-100 rounded-lg aspect-video mb-4 flex items-center justify-center">
                  <p className="text-gray-500">No image</p>
                </div>
              )}
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  New Image
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Generate an image using DALL-E 3
                </p>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-4">Article Status</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input type="radio" className="mr-2" name="status" defaultChecked />
                    <span>Used</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" className="mr-2" name="status" />
                    <span>Unused</span>
                  </label>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-4">Notes</h3>
                <textarea
                  className="w-full h-32 p-2 border rounded-lg resize-none"
                  placeholder="Add notes about this article..."
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
