import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KeywordsAITabProps {
  keywordInput: string;
  setKeywordInput: (value: string) => void;
  keywords: string[];
  onAddKeyword: () => void;
  onDeleteKeyword: (keyword: string) => void;
  onGenerateTopics: () => void;
}

export function KeywordsAITab({
  keywordInput,
  setKeywordInput,
  keywords,
  onAddKeyword,
  onDeleteKeyword,
  onGenerateTopics,
}: KeywordsAITabProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-500 mb-4">
        Provide the keywords related to the article topics you're interested in. Based on them, Copymate will generate 10 topic suggestions.
      </p>
      <p className="text-sm text-purple-600 mb-4">This option is free.</p>
      
      <div className="flex gap-2">
        <Input 
          type="text" 
          placeholder="employee productivity"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onAddKeyword();
            }
          }}
        />
        <Button 
          onClick={onAddKeyword}
          className="bg-purple-100 text-purple-600 hover:bg-purple-200"
        >
          Add
        </Button>
      </div>

      {keywords.length > 0 && (
        <>
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">List of your keywords</h3>
            <div className="space-y-2">
              {keywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between bg-purple-50 p-2 rounded">
                  <span className="text-purple-600">{keyword}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteKeyword(keyword)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={onGenerateTopics}
            className="w-full bg-purple-600 text-white hover:bg-purple-700 mt-4"
          >
            Generate
          </Button>
        </>
      )}
    </div>
  );
}