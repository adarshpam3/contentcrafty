import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
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
  isHtmlContent = false 
}: ArticleContentProps) {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState<'html' | 'original'>('html');
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

  // Function to extract text content from HTML
  const getTextFromHtml = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Function to convert HTML to Markdown-like format
  const convertHtmlToOriginal = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  
  const convertNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue || "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const element = node as HTMLElement;
    switch (element.tagName.toLowerCase()) {
      case "h1":
        return `# ${element.textContent}\n\n`;
      case "h2":
        return `## ${element.textContent}\n\n`;
      case "h3":
        return `### ${element.textContent}\n\n`;
      case "p":
        return `${element.textContent}\n\n`;
      case "strong":
        return `**${element.textContent}**`;
      case "em":
        return `_${element.textContent}_`;
      case "ul":
        return `\n${Array.from(element.children).map((li) => `* ${convertNode(li)}`).join("\n")}\n`;
      case "ol":
        return `\n${Array.from(element.children).map((li, i) => `${i + 1}. ${convertNode(li)}`).join("\n")}\n`;
      case "br":
        return `\n`;
      case "a":
        return `[${element.textContent}](${element.getAttribute("href")})`;
      case "code":
        return `\`${element.textContent}\``;
      case "pre":
        return `\n\`\`\`\n${element.textContent}\n\`\`\`\n`;
      default:
        return element.textContent || "";
    }
  };

  return convertNode(tempDiv).trim();
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
                  onClick={() => setPreviewMode('html')}
                  className={previewMode === 'html' ? 'bg-[#e6f4ea] text-[#06962c]' : ''}
                >
                  HTML
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode('original')}
                  className={previewMode === 'original' ? 'bg-[#e6f4ea] text-[#06962c]' : ''}
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
            <Button 
              onClick={onSave}
              className="bg-[#06962c] hover:bg-[#057a24]"
            >
              Save Changes
            </Button>
          </div>
        </div>

        {!isHtmlContent && <EditorToolbar formatButtons={formatButtons.map(btn => ({
          ...btn,
          action: () => insertText(btn.beforeText, btn.afterText)
        }))} />}

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
              previewMode === 'html' ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {convertHtmlToOriginal(content)}
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
