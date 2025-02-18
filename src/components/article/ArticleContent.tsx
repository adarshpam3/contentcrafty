
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ArticleStats } from "./ArticleStats";
import { ArticleToolbar } from "./ArticleToolbar";
import { ArticlePreview } from "./ArticlePreview";
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <ArticleStats 
        topic={topic} 
        wordCount={wordCount} 
        charCount={charCount} 
      />

      <Tabs defaultValue="edit" className="w-full">
        <ArticleToolbar
          isHtmlContent={isHtmlContent}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          onSave={onSave}
        />

        {!isHtmlContent && (
          <EditorToolbar 
            formatButtons={formatButtons.map(btn => ({
              ...btn,
              action: () => insertText(btn.beforeText, btn.afterText)
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
          <ArticlePreview
            content={content}
            isHtmlContent={isHtmlContent}
            previewMode={previewMode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
