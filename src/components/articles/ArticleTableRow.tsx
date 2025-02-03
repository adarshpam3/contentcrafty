import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];

interface ArticleTableRowProps {
  article: Article & {
    projects: {
      name: string | null;
    } | null;
  };
  onDelete: (e: React.MouseEvent, id: string) => Promise<void>;
}

export const ArticleTableRow = ({ article, onDelete }: ArticleTableRowProps) => {
  const navigate = useNavigate();

  return (
    <tr 
      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => navigate(`/articles/${article.id}`)}
    >
      <td className="p-4">
        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
          {article.projects?.name || 'No Project'}
        </span>
      </td>
      <td className="p-4 text-gray-900">
        {article.topic}
      </td>
      <td className="p-4 text-gray-600">{article.word_count || 0}</td>
      <td className="p-4 text-gray-600">{article.character_count || 0}</td>
      <td className="p-4">
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
          {article.status || 'pending'}
        </span>
      </td>
      <td className="p-4">
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-700"
          onClick={(e) => onDelete(e, article.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </td>
    </tr>
  );
};