
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Topic } from "@/types/ecommerce";

interface StepFourProps {
  categories: Topic[];
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
                  <th className="text-left py-2 px-4 text-gray-600">Title</th>
                  <th className="text-left py-2 px-4 text-gray-600">H2 Headings</th>
                  <th className="text-left py-2 px-4 text-gray-600">Options</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((topic, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-4">{topic.title}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {topic.h2Headings.join(", ")}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {Object.entries(topic.options)
                        .filter(([_, value]) => value)
                        .map(([key]) => key)
                        .join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="col-span-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Articles:</span>
              <span className="text-gray-900">{categories.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Language:</span>
              <span className="text-gray-900">{selectedLanguage || "not selected"}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
