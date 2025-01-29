import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { generateTopicsFromKeywords } from "@/utils/openai";
import { toast } from "@/components/ui/use-toast";

interface KeywordsAITabProps {
  keywordInput: string;
  setKeywordInput: (value: string) => void;
  keywords: string[];
  onAddKeyword: () => void;
  onDeleteKeyword: (keyword: string) => void;
  onGenerateTopics: (topics: Array<{
    title: string;
    h2Headings: string[];
    options: {
      addH2: boolean;
      faq: boolean;
      tableOfContents: boolean;
      generateImage: boolean;
    };
  }>) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

export function KeywordsAITab({
  keywordInput,
  setKeywordInput,
  keywords,
  onAddKeyword,
  onDeleteKeyword,
  onGenerateTopics,
  isGenerating,
  setIsGenerating,
}: KeywordsAITabProps) {
  const handleGenerateTopics = async () => {
    if (keywords.length === 0) {
      toast({
        title: "Keywords Required",
        description: "Please add at least one keyword to generate topics.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedTopics = await generateTopicsFromKeywords(keywords);
      
      const formattedTopics = generatedTopics.map(({ title, h2Headings = [] }) => ({
        title,
        h2Headings,
        options: {
          addH2: h2Headings.length > 0,
          faq: true,
          tableOfContents: true,
          generateImage: false,
        },
      }));

      onGenerateTopics(formattedTopics);
      
      toast({
        title: "Success!",
        description: `Generated ${generatedTopics.length} topics based on your keywords.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate topics. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-500 mb-4">
        Provide the keywords related to the article topics you're interested in. Based on them, Copymate will generate 10 topic suggestions with H2 headings.
      </p>
      
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
            onClick={handleGenerateTopics}
            className="w-full bg-purple-600 text-white hover:bg-purple-700 mt-4"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </span>
            ) : (
              'Generate'
            )}
          </Button>
        </>
      )}

      <Dialog open={isGenerating} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <h2 className="text-lg font-semibold">Please wait, topics generation in progress...</h2>
            <p className="text-gray-500">Do not leave this screen while generating articles!</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}