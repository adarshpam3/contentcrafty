import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Review</h2>
        <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
          Latest GPT
        </Button>
      </div>
      <p className="text-gray-500 mb-6">
        Select Model and check if everything is ok and create your content!
      </p>
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
                  {topic.options.addH2 && topic.h2Headings.length > 0 ? "✓" : ""}
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
    </Card>
  );
}