
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
    // Extract body content if full HTML document is provided
    let processedContent = content;
    if (content.includes('<body>')) {
      const bodyMatch = content.match(/<body>([\s\S]*?)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        processedContent = bodyMatch[1].trim();
      }
    }

    return (
      <div className="p-4 border rounded-lg min-h-[500px]">
        {previewMode === 'html' ? (
          <div className="prose max-w-none">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ 
                __html: processedContent
              }} 
            />
            <style>{`
              .article-content {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              .article-content h1 {
                font-size: 2.25rem;
                font-weight: 600;
                color: #333;
                margin-bottom: 1.5rem;
                line-height: 1.2;
                border-bottom: 2px solid #eaeaea;
                padding-bottom: 0.5rem;
              }
              .article-content h2 {
                font-size: 1.75rem;
                font-weight: 600;
                color: #444;
                margin-top: 2.5rem;
                margin-bottom: 1rem;
                line-height: 1.3;
              }
              .article-content h3 {
                font-size: 1.4rem;
                font-weight: 600;
                color: #555;
                margin-top: 2rem;
                margin-bottom: 0.75rem;
              }
              .article-content p {
                margin-bottom: 1.25rem;
                line-height: 1.7;
                color: #4a5568;
                font-size: 1.1rem;
              }
              .article-content ul, .article-content ol {
                margin: 1.5rem 0;
                padding-left: 2rem;
                list-style-type: disc;
              }
              .article-content ol {
                list-style-type: decimal;
              }
              .article-content li {
                margin-bottom: 0.5rem;
                line-height: 1.6;
                color: #4a5568;
              }
              .article-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 2rem 0;
                border: 1px solid #e2e8f0;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .article-content th {
                background-color: #f8fafc;
                font-weight: 600;
                text-align: left;
                padding: 1rem;
                border: 1px solid #e2e8f0;
                color: #2d3748;
              }
              .article-content td {
                padding: 1rem;
                border: 1px solid #e2e8f0;
                color: #4a5568;
              }
              .article-content tr:nth-child(even) {
                background-color: #f8fafc;
              }
              .article-content tr:hover {
                background-color: #f1f5f9;
              }
              .article-content blockquote {
                margin: 1.5rem 0;
                padding: 1rem 1.5rem;
                border-left: 4px solid #06962c;
                background-color: #f8fafc;
                font-style: italic;
                color: #4a5568;
              }
              .article-content code {
                background-color: #f1f5f9;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                font-family: monospace;
                font-size: 0.9em;
                color: #06962c;
              }
              .article-content pre {
                background-color: #1a202c;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 1.5rem 0;
              }
              .article-content pre code {
                background-color: transparent;
                color: #e2e8f0;
                padding: 0;
              }
              .article-content img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1.5rem 0;
              }
              .article-content a {
                color: #06962c;
                text-decoration: none;
                border-bottom: 1px dashed #06962c;
              }
              .article-content a:hover {
                border-bottom: 1px solid #06962c;
              }
              .article-content hr {
                margin: 2rem 0;
                border: 0;
                border-top: 2px solid #eaeaea;
              }
              .article-content meta, .article-content title, .article-content head {
                display: none;
              }
            `}</style>
          </div>
        ) : (
          <div className="font-mono text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded">
            {content}
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
