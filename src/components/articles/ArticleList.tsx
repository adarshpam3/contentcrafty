import React from "react";
import { ArticleTableRow } from "./ArticleTableRow";
import { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];

interface ArticleListProps {
  articles: (Article & {
    projects: {
      name: string | null;
    } | null;
  })[];
  isLoading: boolean;
  onDelete: (e: React.MouseEvent, id: string) => Promise<void>;
}

export const ArticleList = ({ articles, isLoading, onDelete }: ArticleListProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Project</th>
            <th className="text-left p-4 font-medium">Title</th>
            <th className="text-left p-4 font-medium">Words</th>
            <th className="text-left p-4 font-medium">Characters</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Delete</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : articles.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No articles found
              </td>
            </tr>
          ) : (
            articles.map((article) => (
              <ArticleTableRow 
                key={article.id} 
                article={article}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};