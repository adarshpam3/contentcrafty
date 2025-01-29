import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pencil, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ManualTopicForm } from "./ManualTopicForm";
import { TopicsList } from "./TopicsList";
import { KeywordsAITab } from "./KeywordsAITab";
import { UploadCSVTab } from "./UploadCSVTab";

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

interface ContentTabsProps {
  currentTab: string;
  setCurrentTab: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  options: Topic["options"];
  setOptions: (options: Topic["options"]) => void;
  h2Headings: string;
  setH2Headings: (value: string) => void;
  topics: Topic[];
  onAddTopic: () => void;
  onRemoveTopic: (index: number) => void;
  onUpdateTopic: (index: number, topic: Topic) => void;
  keywordInput: string;
  setKeywordInput: (value: string) => void;
  keywords: string[];
  onAddKeyword: () => void;
  onDeleteKeyword: (keyword: string) => void;
  onGenerateTopics: (topics: Topic[]) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

export function ContentTabs({
  currentTab,
  setCurrentTab,
  topic,
  setTopic,
  options,
  setOptions,
  h2Headings,
  setH2Headings,
  topics,
  onAddTopic,
  onRemoveTopic,
  onUpdateTopic,
  keywordInput,
  setKeywordInput,
  keywords,
  onAddKeyword,
  onDeleteKeyword,
  onGenerateTopics,
  isGenerating,
  setIsGenerating,
}: ContentTabsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Add topics</h2>
      <Tabs defaultValue="manual" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Add manually
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            Keywords AI
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload CSV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <ManualTopicForm
            topic={topic}
            setTopic={setTopic}
            options={options}
            setOptions={setOptions}
            h2Headings={h2Headings}
            setH2Headings={setH2Headings}
            onAddTopic={onAddTopic}
          />
          <TopicsList 
            topics={topics} 
            onRemoveTopic={onRemoveTopic}
            onUpdateTopic={onUpdateTopic}
          />
        </TabsContent>

        <TabsContent value="keywords">
          <KeywordsAITab
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
            keywords={keywords}
            onAddKeyword={onAddKeyword}
            onDeleteKeyword={onDeleteKeyword}
            onGenerateTopics={onGenerateTopics}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </TabsContent>

        <TabsContent value="upload">
          <UploadCSVTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
}