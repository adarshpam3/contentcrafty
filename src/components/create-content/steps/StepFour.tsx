
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Review</h2>
            <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
              GPT-4
            </Button>
          </div>
          <p className="text-gray-500 mb-6">
            Check if everything is ok before describing your categories!
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-gray-600">Category</th>
                  <th className="text-left py-2 px-4 text-gray-600">Keywords</th>
                  <th className="text-left py-2 px-4 text-gray-600">Key Features</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-4">{category.categoryName}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {category.keywords.length > 50 
                        ? category.keywords.substring(0, 50) + "..."
                        : category.keywords}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {category.keyFeatures.length > 50 
                        ? category.keyFeatures.substring(0, 50) + "..."
                        : category.keyFeatures}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      <div className="col-span-1">
        <Summary 
          categories={categories.length} 
          selectedLanguage={selectedLanguage}
        />
      </div>
    </div>
  );
}
