
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Download, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ArticleView() {
  const { articleId } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, projects(name)")
        .eq("id", articleId)
        .single();

      if (error) throw error;
      return data;
    },
  });

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
                  <span>Words: {article.word_count || 0}</span>
                  <span>Characters: {article.character_count || 0}</span>
                </div>
              </div>

              <Tabs defaultValue="edit" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">Export Article</Button>
                    <Button variant="outline">Copy share link</Button>
                    <Button>Save</Button>
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
                  </div>
                </div>

                <TabsContent value="edit">
                  <textarea
                    className="w-full min-h-[500px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={article.content}
                    onChange={() => {}}
                  />
                </TabsContent>
                <TabsContent value="html">
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{article.content}</code>
                  </pre>
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
                    <input type="radio" className="mr-2" name="status" checked />
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
