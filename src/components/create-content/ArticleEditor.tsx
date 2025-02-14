
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Bold, Italic, Underline, Strikethrough, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Table, Image as ImageIcon, Code, Quote, Undo, Redo } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

interface ArticleEditorProps {
  content: string;
  wordCount: number;
  characterCount: number;
  onSave: () => void;
}

export function ArticleEditor({ content, wordCount, characterCount, onSave }: ArticleEditorProps) {
  const [activeTab, setActiveTab] = useState("edit");
  const { toast } = useToast();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const formatButtons = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
    { icon: Strikethrough, label: "Strike" },
    { icon: LinkIcon, label: "Link" },
    { icon: AlignLeft, label: "Align Left" },
    { icon: AlignCenter, label: "Align Center" },
    { icon: AlignRight, label: "Align Right" },
    { icon: List, label: "Bullet List" },
    { icon: ListOrdered, label: "Numbered List" },
    { icon: Table, label: "Table" },
    { icon: ImageIcon, label: "Image" },
    { icon: Code, label: "Code" },
    { icon: Quote, label: "Quote" },
  ];

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
              navigator.clipboard.writeText(window.location.href);
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <div className="border-b border-gray-200 my-2">
          <div className="flex flex-wrap gap-2 p-2">
            {formatButtons.map((button) => (
              <Button
                key={button.label}
                variant="ghost"
                size="sm"
                className="p-2 h-8"
                title={button.label}
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
            <div className="border-l border-gray-200 mx-2" />
            <Button variant="ghost" size="sm" className="p-2 h-8" title="Undo">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-8" title="Redo">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="min-h-[500px]">
          <div className="relative">
            <textarea
              className="w-full min-h-[500px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={content}
              onChange={(e) => {
                // Handle content change if needed
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="min-h-[500px] p-4 border rounded-md">
          <div className="prose max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-4 right-4">
        <Button
          onClick={() => setIsGeneratingImage(true)}
          disabled={isGeneratingImage}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isGeneratingImage ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating image...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Featured Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
