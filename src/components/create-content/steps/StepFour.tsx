
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Topic {
  title: string;
  h2Headings: string[];
  options: {
    addH2: boolean;
    faq: boolean;
    tableOfContents: boolean;
    generateImage: boolean;
  };
}

interface Category {
  storeName: string;
  categoryName: string;
  keywords: string;
  keyFeatures: string;
}

interface StepFourProps {
  categories: Category[];
}

export function StepFour({ categories }: StepFourProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Review</h2>
        <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
          Latest GPT
        </Button>
      </div>
      <p className="text-gray-500 mb-6">
        Check if everything is ok before describing your categories!
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Category</th>
              <th className="text-left py-2 px-4">Store</th>
              <th className="text-left py-2 px-4">Keywords</th>
              <th className="text-left py-2 px-4">Key Features</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4 text-purple-600">{category.categoryName}</td>
                <td className="py-2 px-4">{category.storeName}</td>
                <td className="py-2 px-4">{category.keywords}</td>
                <td className="py-2 px-4">{category.keyFeatures.substring(0, 50)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
