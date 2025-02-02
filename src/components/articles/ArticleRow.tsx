import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];

interface ArticleRowProps {
  article: Article;
  onDelete: (id: string) => void;
}

export function ArticleRow({ article, onDelete }: ArticleRowProps) {
  return (
    <tr className="border-b">
      <td className="p-4">
        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
          {article.project_id}
        </span>
      </td>
      <td className="p-4">{article.topic}</td>
      <td className="p-4">
        {article.content?.split(" ").length || 0}
      </td>
      <td className="p-4">
        {article.content?.length || 0}
      </td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full ${
          article.status === 'completed' 
            ? 'bg-green-100 text-green-600'
            : 'bg-yellow-100 text-yellow-600'
        }`}>
          {article.status}
        </span>
      </td>
      <td className="p-4">
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(article.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="ml-2">Delete</span>
        </Button>
      </td>
    </tr>
  );
}