
import React from "react";
import { ArticleTableRow } from "./ArticleTableRow";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

type Article = Database["public"]["Tables"]["articles"]["Row"];

interface ArticleListProps {
  articles: (Article & {
    projects: {
      name: string | null;
    } | null;
  })[];
  isLoading: boolean;
}

export const ArticleList = ({ articles, isLoading }: ArticleListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['articles'] });

      toast({
        title: "Article deleted",
        description: "The article has been permanently deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the article",
        variant: "destructive",
      });
    }
  };

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
                onDelete={handleDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
