
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { Editor } from '@tinymce/tinymce-react';
import {
  Loader2,
  Download,
  Printer,
  Copy,
  RotateCcw,
} from "lucide-react";

export default function ArticleView() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef<any>(null);

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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${article?.topic || 'Article'}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="p-8">
            <div class="prose max-w-none">
              ${content}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <p className="text-red-500">Error loading article: {error.message}</p>
        <Button onClick={() => navigate("/articles")} variant="outline">
          Return to Articles
        </Button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <p className="text-gray-500">Article not found</p>
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

              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Button
                    variant={!isPreview ? "default" : "outline"}
                    onClick={() => setIsPreview(false)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={isPreview ? "default" : "outline"}
                    onClick={() => setIsPreview(true)}
                  >
                    Preview
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied",
                        description: "Share link has been copied to clipboard",
                      });
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy link
                  </Button>
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              </div>

              {!isPreview ? (
                <Editor
                  apiKey="your-tinymce-api-key"
                  onInit={(evt, editor) => editorRef.current = editor}
                  value={content}
                  onEditorChange={(newContent) => setContent(newContent)}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                      'codesample'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                      'bold italic underline strikethrough | forecolor backcolor | subscript superscript | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | link image table | ' +
                      'removeformat code fullscreen | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    skin: 'oxide',
                    toolbar_sticky: true,
                    autosave_ask_before_unload: true,
                    table_responsive_width: true,
                    image_caption: true,
                    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
                    contextmenu: 'link image table',
                    branding: false,
                  }}
                />
              ) : (
                <div className="prose max-w-none border rounded-lg p-6">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              )}
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
