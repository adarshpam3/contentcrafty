import { Database } from "@/integrations/supabase/types";
import { ArticleRow } from "./ArticleRow";

type Article = Database["public"]["Tables"]["articles"]["Row"];

interface ArticlesTableProps {
  articles: Article[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function ArticlesTable({ articles, isLoading, onDelete }: ArticlesTableProps) {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={6} className="text-center p-4">
          Loading...
        </td>
      </tr>
    );
  }

  if (articles.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center p-4">
          No articles found
        </td>
      </tr>
    );
  }

  return (
    <>
      {articles.map((article) => (
        <ArticleRow
          key={article.id}
          article={article}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}