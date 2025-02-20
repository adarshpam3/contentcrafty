
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
          <div className="prose max-w-none">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ 
                __html: content.replace(/\n/g, '<br />')
              }} 
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333'
              }}
            />
            <style>{`
              .article-content h1 {
                font-size: 2.25rem;
                font-weight: 600;
                color: #333;
                margin-bottom: 1.5rem;
              }
              .article-content h2 {
                font-size: 1.75rem;
                font-weight: 600;
                color: #444;
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              .article-content p {
                margin-bottom: 1.25rem;
                line-height: 1.7;
              }
              .article-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
                border: 1px solid #e2e8f0;
              }
              .article-content th {
                background-color: #f8fafc;
                font-weight: 600;
                text-align: left;
                padding: 0.75rem;
                border: 1px solid #e2e8f0;
              }
              .article-content td {
                padding: 0.75rem;
                border: 1px solid #e2e8f0;
              }
              .article-content tr:nth-child(even) {
                background-color: #f8fafc;
              }
            `}</style>
          </div>
        ) : (
          <div className="font-mono text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded">
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
