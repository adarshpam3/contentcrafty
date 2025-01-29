import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TopicOptions {
  addH2: boolean;
  faq: boolean;
  tableOfContents: boolean;
  generateImage: boolean;
}

interface ManualTopicFormProps {
  topic: string;
  setTopic: (value: string) => void;
  options: TopicOptions;
  setOptions: (options: TopicOptions) => void;
  h2Headings: string;
  setH2Headings: (value: string) => void;
  onAddTopic: () => void;
}

export function ManualTopicForm({
  topic,
  setTopic,
  options,
  setOptions,
  h2Headings,
  setH2Headings,
  onAddTopic,
}: ManualTopicFormProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-500 mb-4">
        Add topics for your articles manually. Each topic is one article.
      </p>
      <div>
        <label className="block text-sm font-medium mb-1">Topic:</label>
        <Input 
          type="text" 
          placeholder="How To Improve Productivity In My Business?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Options</label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="h2" 
              checked={options.addH2}
              onCheckedChange={(checked) => 
                setOptions({ ...options, addH2: checked as boolean })
              }
            />
            <label htmlFor="h2">Add H2 headings manually</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="faq" 
              checked={options.faq}
              onCheckedChange={(checked) => 
                setOptions({ ...options, faq: checked as boolean })
              }
            />
            <label htmlFor="faq">FAQ</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="toc" 
              checked={options.tableOfContents}
              onCheckedChange={(checked) => 
                setOptions({ ...options, tableOfContents: checked as boolean })
              }
            />
            <label htmlFor="toc">Table of Contents</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="image" 
              checked={options.generateImage}
              onCheckedChange={(checked) => 
                setOptions({ ...options, generateImage: checked as boolean })
              }
            />
            <label htmlFor="image">Generate Image</label>
          </div>
        </div>
      </div>

      {options.addH2 && (
        <div>
          <label className="block text-sm font-medium mb-1">H2 Headings:</label>
          <Textarea
            placeholder="Each H2 heading in new line"
            value={h2Headings}
            onChange={(e) => setH2Headings(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      )}
      
      <Button 
        className="w-full bg-purple-100 text-purple-600 hover:bg-purple-200"
        onClick={onAddTopic}
      >
        Add
      </Button>
    </div>
  );
}