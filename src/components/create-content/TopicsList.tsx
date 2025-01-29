import { Check } from "lucide-react";
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

interface TopicsListProps {
  topics: Topic[];
  onRemoveTopic: (index: number) => void;
}

export function TopicsList({ topics, onRemoveTopic }: TopicsListProps) {
  if (topics.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="grid grid-cols-5 gap-4 py-2 font-medium text-sm text-gray-500">
        <div>Topics</div>
        <div>H2s</div>
        <div>FAQ</div>
        <div>TOC</div>
        <div>Image</div>
      </div>
      {topics.map((topic, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 py-3 border-t">
          <div className="text-purple-600">{topic.title}</div>
          <div>{topic.options.addH2 && topic.h2Headings.length > 0 ? <Check className="w-4 h-4" /> : null}</div>
          <div>{topic.options.faq ? <Check className="w-4 h-4" /> : null}</div>
          <div>{topic.options.tableOfContents ? <Check className="w-4 h-4" /> : null}</div>
          <div className="flex items-center justify-between">
            {topic.options.generateImage ? (
              <span className="text-xs text-gray-500">prompt</span>
            ) : null}
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 h-auto text-xs"
              onClick={() => onRemoveTopic(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}