
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Article {
  id: string;
  topic: string;
  word_count: number;
  character_count: number;
  status: string;
}

interface ArticlesTabProps {
  articles: Article[];
}

export function ArticlesTab({ articles }: ArticlesTabProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const handleDelete = async (articleId: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Article deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["project-content"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
  };

  if (articles.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 text-center shadow-sm border border-purple-200">
        <p className="text-purple-800 font-medium mb-4 text-lg">
          You don't have any articles assigned to this project yet. Use one of our models and start creating outstanding content!
        </p>
        <Button 
          onClick={() => navigate("/create-page")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          Create Content
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Search by article title..."
          className="max-w-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        />
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
          >
            Delete Selected
          </Button>
          <Button 
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 font-medium"
          >
            Export
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-purple-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50">
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-purple-300" />
              </TableHead>
              <TableHead className="font-semibold text-purple-900">Title</TableHead>
              <TableHead className="font-semibold text-purple-900">Words</TableHead>
              <TableHead className="font-semibold text-purple-900">Characters</TableHead>
              <TableHead className="font-semibold text-purple-900">Status</TableHead>
              <TableHead className="font-semibold text-purple-900">Used</TableHead>
              <TableHead className="font-semibold text-purple-900">Comment</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow 
                key={article.id}
                className="cursor-pointer hover:bg-purple-50/50 transition-colors"
                onClick={() => navigate(`/articles/${article.id}`)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded border-purple-300" />
                </TableCell>
                <TableCell className="font-medium text-purple-900">{article.topic}</TableCell>
                <TableCell className="text-gray-700">{article.word_count || 0}</TableCell>
                <TableCell className="text-gray-700">{article.character_count || 0}</TableCell>
                <TableCell>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {article.status || 'completed'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-red-500">×</span>
                </TableCell>
                <TableCell className="text-gray-500">-</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setArticleToDelete(article.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-purple-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-purple-900">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete this article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-purple-200 text-purple-700 hover:bg-purple-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => articleToDelete && handleDelete(articleToDelete)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
