
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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
    </div>
  );
}
