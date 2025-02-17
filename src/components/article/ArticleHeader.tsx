
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ArticleHeaderProps {
  projectName?: string;
}

export function ArticleHeader({ projectName }: ArticleHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link
          to="/articles"
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <span className="text-gray-600">Back to Articles</span>
      </div>
      {projectName && (
        <span className="text-gray-600">Project: {projectName}</span>
      )}
    </div>
  );
}
