
import { Button } from "@/components/ui/button";
import { Topic } from "@/types/ecommerce";

interface CategoryListProps {
  categories: Topic[];
  onDeleteCategory: (index: number) => void;
}

export function CategoryList({ categories, onDeleteCategory }: CategoryListProps) {
  if (categories.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="grid grid-cols-4 gap-4 py-2 font-medium text-sm text-gray-500">
        <div>Category</div>
        <div>Store</div>
        <div>Keywords</div>
        <div>Key Features</div>
      </div>
      {categories.map((category, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 py-3 border-t items-center">
          <div className="text-purple-600">{category.title}</div>
          <div className="text-gray-600">-</div>
          <div className="text-gray-600">-</div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 truncate">
              {category.h2Headings.join(", ").substring(0, 50)}...
            </span>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 h-auto text-xs"
              onClick={() => onDeleteCategory(index)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
