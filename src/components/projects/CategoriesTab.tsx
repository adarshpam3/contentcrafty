
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
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

interface Category {
  id: string;
  topic: string;
  category_description: string;
  word_count: number;
  character_count: number;
  status: string;
}

interface CategoriesTabProps {
  categories: Category[];
}

export function CategoriesTab({ categories }: CategoriesTabProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleDelete = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      // Refresh the data
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

  if (categories.length === 0) {
    return (
      <div className="bg-purple-50 rounded-lg p-6 text-center">
        <p className="text-purple-700 mb-4">
          You don't have any categories yet. Create your first category using our e-commerce model!
        </p>
        <Button 
          onClick={() => navigate("/create-ecommerce-content")}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Create Category
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Input
          placeholder="search by category..."
          className="max-w-sm"
        />
        <Button 
          onClick={() => navigate("/create-ecommerce-content")}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Create Category
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Words</TableHead>
              <TableHead>Characters</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Button
                    variant="link"
                    className="text-purple-600 hover:text-purple-800 p-0 h-auto font-medium"
                    onClick={() => navigate(`/category/${category.id}`)}
                  >
                    {category.topic}
                  </Button>
                </TableCell>
                <TableCell className="text-gray-600 max-w-md truncate">
                  {category.category_description || '-'}
                </TableCell>
                <TableCell className="text-gray-600">
                  {category.word_count || 0}
                </TableCell>
                <TableCell className="text-gray-600">
                  {category.character_count || 0}
                </TableCell>
                <TableCell>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {category.status || 'completed'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCategoryToDelete(category.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 h-auto text-sm"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => categoryToDelete && handleDelete(categoryToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
