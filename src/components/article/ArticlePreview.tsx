
import ReactMarkdown from 'react-markdown';
import { convertHtmlToOriginal } from './utils/htmlConverter';

interface ArticlePreviewProps {
  content: string;
  isHtmlContent?: boolean;
  previewMode: 'html' | 'original';
}

export function ArticlePreview({ content, isHtmlContent, previewMode }: ArticlePreviewProps) {
  if (isHtmlContent) {
    // For HTML content, show either raw HTML or converted original format
    return (
      <div className="p-4 border rounded-lg min-h-[500px]">
        {previewMode === 'html' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {convertHtmlToOriginal(content)}
          </pre>
        )}
      </div>
    );
  }

  // For non-HTML content, show markdown preview
  return (
    <div className="p-4 border rounded-lg min-h-[500px]">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
