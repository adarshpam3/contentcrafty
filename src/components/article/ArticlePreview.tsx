
import ReactMarkdown from 'react-markdown';
import { convertHtmlToOriginal } from './utils/htmlConverter';

interface ArticlePreviewProps {
  content: string;
  isHtmlContent?: boolean;
  previewMode: 'html' | 'original';
}

export function ArticlePreview({ content, isHtmlContent, previewMode }: ArticlePreviewProps) {
  return (
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
  );
}
