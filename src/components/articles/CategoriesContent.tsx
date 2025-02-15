import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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

interface CategoriesContentProps {
  categories: Category[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CategoriesContent({ 
  categories, 
  isLoading,
  searchQuery,
  onSearchChange
}: CategoriesContentProps) {
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

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading categories...</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="bg-[#e6f4ea] rounded-lg p-8 text-center border border-[#b8e6c4]">
        <p className="text-[#06962c] mb-4 text-lg">
          You don't have any categories yet. Create your first category using our e-commerce model!
        </p>
        <Button 
          onClick={() => navigate("/create-ecommerce-content")}
          className="bg-[#06962c] hover:bg-[#057a24] text-white"
        >
          Create Category
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by category..."
          className="max-w-sm border-gray-200 focus:ring-[#06962c]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button 
          onClick={() => navigate("/create-ecommerce-content")}
          className="bg-[#06962c] hover:bg-[#057a24] text-white"
        >
          Create Category
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f8f9fa]">
            <TableRow>
              <TableHead className="text-gray-600">Category</TableHead>
              <TableHead className="text-gray-600">Description</TableHead>
              <TableHead className="text-gray-600">Words</TableHead>
              <TableHead className="text-gray-600">Characters</TableHead>
              <TableHead className="text-gray-600">Status</TableHead>
              <TableHead className="text-gray-600">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow 
                key={category.id}
                className="hover:bg-[#f8f9fa] cursor-pointer"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest('button')) {
                    navigate(`/category/${category.id}`);
                  }
                }}
              >
                <TableCell className="font-medium text-[#06962c]">
                  {category.topic}
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
                  <span className="bg-[#e6f4ea] text-[#06962c] px-3 py-1 rounded-full text-sm">
                    {category.status || 'completed'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategoryToDelete(category.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => categoryToDelete && handleDelete(categoryToDelete)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
