
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Summary } from "../Summary";

interface Category {
  storeName: string;
  categoryName: string;
  keywords: string;
  keyFeatures: string;
}

interface StepFourProps {
  categories: Category[];
  selectedLanguage: string;
}

export function StepFour({ categories, selectedLanguage }: StepFourProps) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <Card className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Review</h2>
            <p className="text-gray-500">
              Check if everything is ok before describing your categories!
            </p>
            <Button variant="default" className="mt-4 bg-purple-600 hover:bg-purple-700">
              GPT-4
            </Button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 py-2 font-medium text-sm text-gray-500 border-b">
            <div>Category</div>
            <div>Store</div>
            <div>Keywords</div>
            <div>Key Features</div>
          </div>
          
          {categories.map((category, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 py-4 border-b items-center">
              <div className="text-purple-600">{category.categoryName}</div>
              <div className="text-gray-600">{category.storeName}</div>
              <div className="text-gray-600 truncate">{category.keywords.substring(0, 50)}...</div>
              <div className="text-gray-600 truncate">{category.keyFeatures.substring(0, 50)}...</div>
            </div>
          ))}
        </Card>
      </div>
      
      <div className="col-span-1">
        <Summary
          selectedProject=""
          selectedLanguage={selectedLanguage}
          topicsCount={categories.length}
          imageCount={0}
        />
      </div>
    </div>
  );
}
