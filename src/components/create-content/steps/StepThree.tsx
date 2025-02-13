
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pencil, Upload } from "lucide-react";
import { ManualTopicForm } from "../ManualTopicForm";
import { TopicsList } from "../TopicsList";
import { KeywordsAITab } from "../KeywordsAITab";
import { UploadCSVTab } from "../UploadCSVTab";

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

interface StepThreeProps {
  topic: string;
  setTopic: (value: string) => void;
  options: {
    addH2: boolean;
    faq: boolean;
    tableOfContents: boolean;
    generateImage: boolean;
  };
  setOptions: (options: any) => void;
  h2Headings: string;
  setH2Headings: (value: string) => void;
  handleAddTopic: () => void;
  topics: Topic[];
  handleRemoveTopic: (index: number) => void;
  handleUpdateTopic: (index: number, topic: Topic) => void;
  currentTab: string;
  setCurrentTab: (value: string) => void;
  keywordInput: string;
  setKeywordInput: (value: string) => void;
  keywords: string[];
  handleAddKeyword: () => void;
  handleDeleteKeyword: (keyword: string) => void;
  handleGenerateTopics: (topics: Topic[]) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  selectedLanguage: string;
  checkSubscriptionAccess: () => boolean;
}

export function StepThree({
  topic,
  setTopic,
  options,
  setOptions,
  h2Headings,
  setH2Headings,
  handleAddTopic,
  topics,
  handleRemoveTopic,
  handleUpdateTopic,
  currentTab,
  setCurrentTab,
  keywordInput,
  setKeywordInput,
  keywords,
  handleAddKeyword,
  handleDeleteKeyword,
  handleGenerateTopics,
  isGenerating,
  setIsGenerating,
  selectedLanguage,
  checkSubscriptionAccess,
}: StepThreeProps) {
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
            onAddTopic={handleAddTopic}
          />
          <TopicsList 
            topics={topics} 
            onRemoveTopic={handleRemoveTopic}
            onUpdateTopic={handleUpdateTopic}
          />
        </TabsContent>

        <TabsContent value="keywords">
          <KeywordsAITab
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
            keywords={keywords}
            onAddKeyword={handleAddKeyword}
            onDeleteKeyword={handleDeleteKeyword}
            onGenerateTopics={handleGenerateTopics}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            selectedLanguage={selectedLanguage}
            checkSubscriptionAccess={checkSubscriptionAccess}
          />
        </TabsContent>

        <TabsContent value="upload">
          <UploadCSVTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
