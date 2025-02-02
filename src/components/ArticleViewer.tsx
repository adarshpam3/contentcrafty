import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function ArticleViewer() {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState("edit");

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading article...</div>;
  }

  if (!article) {
    return <div className="p-8">Article not found</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">{article.topic}</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Model: copy-mate-003</span>
          <span>Words: {article.content?.split(" ").length || 0}</span>
          <span>Characters: {article.content?.length || 0}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-4">
            <div className="prose max-w-none">
              {article.content}
            </div>
          </TabsContent>

          <TabsContent value="html" className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {article.content}
            </pre>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button variant="outline">Export Article</Button>
          <Button variant="outline">Copy share link</Button>
          <Button className="bg-purple-600 hover:bg-purple-700">Save</Button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr,300px] gap-8">
        <div className="min-h-[500px] border rounded-lg p-4">
          {article.content}
        </div>

        <div className="space-y-8">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Featured Image</h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              No image
            </div>
            <Button className="w-full">Generate Image</Button>
            <p className="text-sm text-gray-600 text-center mt-2">
              Generate an image using DALL-E 3
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Article Status</h3>
            <RadioGroup defaultValue="unused">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="used" id="used" />
                <Label htmlFor="used">Used</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unused" id="unused" />
                <Label htmlFor="unused">Unused</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Notes</h3>
            <textarea
              className="w-full h-32 p-2 border rounded-lg"
              placeholder="Add notes about this article..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}