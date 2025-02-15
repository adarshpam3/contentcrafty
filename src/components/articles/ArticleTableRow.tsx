
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Article = Database["public"]["Tables"]["articles"]["Row"];

interface ArticleTableRowProps {
  article: Article & {
    projects: {
      name: string | null;
    } | null;
  };
  onDelete: (id: string) => Promise<void>;
}

export const ArticleTableRow = ({ article, onDelete }: ArticleTableRowProps) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    await onDelete(article.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <tr 
        className="border-b border-gray-100 hover:bg-[#f8f9fa] cursor-pointer transition-colors"
        onClick={() => navigate(`/articles/${article.id}`)}
      >
        <td className="p-4">
          <span className="bg-[#e6f4ea] text-[#06962c] px-3 py-1 rounded-full text-sm font-medium">
            {article.projects?.name || 'No Project'}
          </span>
        </td>
        <td className="p-4 text-gray-900 font-medium">
          {article.topic}
        </td>
        <td className="p-4 text-gray-600">{article.word_count || 0}</td>
        <td className="p-4 text-gray-600">{article.character_count || 0}</td>
        <td className="p-4">
          <span className="bg-[#e6f4ea] text-[#06962c] px-3 py-1 rounded-full text-sm">
            {article.status || 'completed'}
          </span>
        </td>
        <td className="p-4">
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </td>
      </tr>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
