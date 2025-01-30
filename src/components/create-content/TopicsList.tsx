import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onUpdateTopic?: (index: number, updatedTopic: Topic) => void;
}

export function TopicsList({ topics, onRemoveTopic, onUpdateTopic }: TopicsListProps) {
  if (topics.length === 0) return null;

  const handleOptionChange = (index: number, optionKey: keyof Topic['options'], checked: boolean) => {
    if (!onUpdateTopic) return;
    
    const updatedTopic = { ...topics[index] };
    updatedTopic.options = {
      ...updatedTopic.options,
      [optionKey]: checked
    };
    onUpdateTopic(index, updatedTopic);
  };

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
        <div key={index} className="grid grid-cols-5 gap-4 py-3 border-t items-center">
          <div className="text-purple-600">{topic.title}</div>
          <div>
            {topic.h2Headings.length > 0 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-gray-600">
                      {topic.h2Headings.length} headings
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <ul className="list-disc pl-4">
                      {topic.h2Headings.map((heading, i) => (
                        <li key={i} className="text-sm">{heading}</li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span className="text-sm text-gray-400">No headings</span>
            )}
          </div>
          <div>
            <Checkbox
              checked={topic.options.faq}
              onCheckedChange={(checked) => handleOptionChange(index, 'faq', checked as boolean)}
              disabled={!onUpdateTopic}
            />
          </div>
          <div>
            <Checkbox
              checked={topic.options.tableOfContents}
              onCheckedChange={(checked) => handleOptionChange(index, 'tableOfContents', checked as boolean)}
              disabled={!onUpdateTopic}
            />
          </div>
          <div className="flex items-center justify-between">
            <Checkbox
              checked={topic.options.generateImage}
              onCheckedChange={(checked) => handleOptionChange(index, 'generateImage', checked as boolean)}
              disabled={!onUpdateTopic}
            />
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