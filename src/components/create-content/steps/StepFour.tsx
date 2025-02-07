
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Topic } from "@/types/ecommerce";
import { Checkbox } from "@/components/ui/checkbox";

interface StepFourProps {
  categories: Topic[];
  selectedLanguage: string;
}

export function StepFour({ categories, selectedLanguage }: StepFourProps) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <Card className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Review</h2>
            <p className="text-gray-500 mb-4">
              Select Model and check if everything is ok and create your content!
            </p>
            <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
              Latest GPT
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 py-2 font-medium text-sm text-gray-500 border-b">
              <div>Topics</div>
              <div>H2s</div>
              <div>FAQ</div>
              <div>Im.</div>
            </div>
            {categories.map((topic, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 py-3 border-b items-center">
                <div className="text-purple-600">{topic.title}</div>
                <div className="text-sm text-gray-600">
                  {topic.h2Headings.length > 0 ? 'auto generated' : 'No headings'}
                </div>
                <div>
                  <Checkbox
                    checked={topic.options.faq}
                    disabled
                  />
                </div>
                <div>
                  <Checkbox
                    checked={topic.options.generateImage}
                    disabled
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-span-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Project:</span>
              <span className="text-gray-900">Fast Writer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Articles to write:</span>
              <span className="text-gray-900">{categories.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Image cost:</span>
              <span className="text-gray-900">0 Tokens</span>
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
