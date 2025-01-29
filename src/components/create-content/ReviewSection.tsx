import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

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

interface ReviewSectionProps {
  topics: Topic[];
}

export function ReviewSection({ topics }: ReviewSectionProps) {
  const navigate = useNavigate();
  const tokenCount = "13 tokens"; // This would typically come from props or a context

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Review</h2>
          <p className="text-gray-500 mt-1">
            Select Model and check if everything is ok and create your content!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{tokenCount}</span>
          <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
            Latest GPT
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Topics</th>
              <th className="text-left py-2 px-4">H2s</th>
              <th className="text-center py-2 px-4">FAQ</th>
              <th className="text-center py-2 px-4">TOC</th>
              <th className="text-center py-2 px-4">Image</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4 text-purple-600">{topic.title}</td>
                <td className="py-2 px-4">
                  {topic.options.addH2 && topic.h2Headings.length > 0 ? (
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-sm">
                      auto generated
                    </span>
                  ) : ""}
                </td>
                <td className="py-2 px-4 text-center">{topic.options.faq ? "✓" : ""}</td>
                <td className="py-2 px-4 text-center">
                  {topic.options.tableOfContents ? "✓" : ""}
                </td>
                <td className="py-2 px-4 text-center">
                  {topic.options.generateImage ? "✓" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="px-6"
        >
          Back
        </Button>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-6"
          onClick={() => {/* Handle create content */}}
        >
          Create Content
        </Button>
      </div>
    </Card>
  );
}