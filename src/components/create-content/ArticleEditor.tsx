import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ArticleEditorProps {
  content: string;
  wordCount: number;
  characterCount: number;
  onSave: () => void;
}

export function ArticleEditor({ content, wordCount, characterCount, onSave }: ArticleEditorProps) {
  const [activeTab, setActiveTab] = useState("edit");
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-x-4">
          <span className="text-sm text-gray-500">Words: {wordCount}</span>
          <span className="text-sm text-gray-500">Characters: {characterCount}</span>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => {
              toast({
                title: "Link copied",
                description: "Share link has been copied to clipboard",
              });
            }}
          >
            Copy share link
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="min-h-[500px] p-4 border rounded-md">
          <div className="prose max-w-none">
            {content}
          </div>
        </TabsContent>
        <TabsContent value="html" className="min-h-[500px] p-4 border rounded-md">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}