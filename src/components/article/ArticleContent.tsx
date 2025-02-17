import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { EditorToolbar } from "./EditorToolbar";
import { formatButtons } from "./editorConfig";

interface ArticleContentProps {
  topic?: string;
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isHtmlContent?: boolean;
}

export function ArticleContent({
  topic,
  content,
  onContentChange,
  onSave,
  isHtmlContent = false,
}: ArticleContentProps) {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState<"html" | "original">("html");
  const wordCount = content.split(/\s+/).length;
  const charCount = content.length;

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

    onContentChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  // Function to convert HTML to Markdown-like format
  const convertHtmlToMarkdown = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Convert basic HTML elements to markdown-like format
    let text = tempDiv.innerHTML;
    text = text.replace(/<h1.*?>(.*?)<\/h1>/gi, "# $1\n\n");
    text = text.replace(/<h2.*?>(.*?)<\/h2>/gi, "## $1\n\n");
    text = text.replace(/<h3.*?>(.*?)<\/h3>/gi, "### $1\n\n");
    text = text.replace(/<p.*?>(.*?)<\/p>/gi, "$1\n\n");
    text = text.replace(/<strong.*?>(.*?)<\/strong>/gi, "**$1**");
    text = text.replace(/<em.*?>(.*?)<\/em>/gi, "_$1_");
    text = text.replace(/<ul.*?>(.*?)<\/ul>/gi, "$1\n");
    text = text.replace(/<li.*?>(.*?)<\/li>/gi, "* $1\n");
    text = text.replace(/<br.*?>/gi, "\n");

    // Remove any remaining HTML tags
    text = text.replace(/<[^>]*>/g, "");

    // Fix spacing
    text = text.replace(/\n\s*\n/g, "\n\n");
    text = text.trim();

    return text;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-medium mb-4 flex items-center gap-2 text-gray-800">
          {topic}
          <span className="text-[#06962c] text-sm font-normal cursor-pointer hover:underline">
            ↗ edit title
          </span>
        </h2>
        <div className="flex gap-4 text-sm bg-[#e6f4ea] p-2 rounded-lg">
          <span className="text-[#06962c]">AI Assistant</span>
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            {isHtmlContent && (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode("html")}
                  className={previewMode === "html" ? "bg-[#e6f4ea] text-[#06962c]" : ""}
                >
                  HTML
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode("original")}
                  className={previewMode === "original" ? "bg-[#e6f4ea] text-[#06962c]" : ""}
                >
                  Original
                </Button>
              </div>
            )}
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
              className="text-gray-600"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={onSave} className="bg-[#06962c] hover:bg-[#057a24]">
              Save Changes
            </Button>
          </div>
        </div>

        {!isHtmlContent && (
          <EditorToolbar
            formatButtons={formatButtons.map((btn) => ({
              ...btn,
              action: () => insertText(btn.beforeText, btn.afterText),
            }))}
          />
        )}

        <TabsContent value="edit">
          <textarea
            className="w-full min-h-[500px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06962c] text-gray-800"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          />
        </TabsContent>
        <TabsContent value="preview" className="prose max-w-none">
          <div className="p-4 border rounded-lg min-h-[500px]">
            {isHtmlContent ? (
              previewMode === "html" ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {convertHtmlToMarkdown(content)}
                </pre>
              )
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
