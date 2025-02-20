
import ReactMarkdown from 'react-markdown';
import { convertHtmlToOriginal } from './utils/htmlConverter';

interface ArticlePreviewProps {
  content: string;
  isHtmlContent?: boolean;
  previewMode: 'html' | 'original';
}

export function ArticlePreview({ content, isHtmlContent, previewMode }: ArticlePreviewProps) {
  // Handle empty content
  if (!content) {
    return (
      <div className="p-4 border rounded-lg min-h-[500px] text-gray-400">
        No content to display
      </div>
    );
  }

  // For HTML content
  if (isHtmlContent) {
    return (
      <div className="p-4 border rounded-lg min-h-[500px]">
        {previewMode === 'html' ? (
          // Show raw HTML with proper parsing
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: content.replace(/\n/g, '<br />') 
            }} 
          />
        ) : (
          // Show converted original format
          <div className="font-mono text-sm whitespace-pre-wrap">
            {convertHtmlToOriginal(content)}
          </div>
        )}
      </div>
    );
  }

  // For markdown content
  return (
    <div className="p-4 border rounded-lg min-h-[500px]">
      <div className="prose max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
