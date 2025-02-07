
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  topic: string;
  category_description: string;
  word_count: number;
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
          placeholder="Search categories..."
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/create-ecommerce-content")}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Create Category
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-4 gap-4 py-2 font-medium text-sm text-gray-500">
          <div>Category</div>
          <div>Description</div>
          <div>Words</div>
          <div>Status</div>
        </div>
        {categories.map((category) => (
          <div key={category.id} className="grid grid-cols-4 gap-4 py-3 border-t items-center">
            <div className="text-purple-600">{category.topic}</div>
            <div className="text-gray-600 truncate">
              {category.category_description || '-'}
            </div>
            <div className="text-gray-600">{category.word_count || 0}</div>
            <div className="flex items-center justify-between">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                {category.status || 'completed'}
              </span>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 h-auto text-xs"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
