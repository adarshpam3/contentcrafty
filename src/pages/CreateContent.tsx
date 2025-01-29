import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Pencil, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import { StepIndicator } from "@/components/create-content/StepIndicator";
import { ProjectSelection } from "@/components/create-content/ProjectSelection";
import { LanguageSelection } from "@/components/create-content/LanguageSelection";
import { ManualTopicForm } from "@/components/create-content/ManualTopicForm";
import { TopicsList } from "@/components/create-content/TopicsList";
import { KeywordsAITab } from "@/components/create-content/KeywordsAITab";
import { UploadCSVTab } from "@/components/create-content/UploadCSVTab";

const steps = [
  { number: 1, title: "Select Project", current: true },
  { number: 2, title: "Select language", current: false },
  { number: 3, title: "Add topics", current: false },
  { number: 4, title: "Review", current: false },
  { number: 5, title: "Done", current: false },
];

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

export default function CreateContent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [currentTab, setCurrentTab] = useState("manual");
  const [h2Headings, setH2Headings] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [options, setOptions] = useState({
    addH2: false,
    faq: false,
    tableOfContents: false,
    generateImage: false,
  });
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleAddTopic = () => {
    if (!topic) return;

    const newTopic: Topic = {
      title: topic,
      h2Headings: h2Headings.split('\n').filter(heading => heading.trim()),
      options: { ...options },
    };

    setTopics([...topics, newTopic]);
    setTopic("");
    setH2Headings("");
    setOptions({
      addH2: false,
      faq: false,
      tableOfContents: false,
      generateImage: false,
    });
  };

  const handleRemoveTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    setKeywords([...keywords, keywordInput.trim()]);
    setKeywordInput("");
  };

  const handleDeleteKeyword = (keywordToDelete: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete));
  };

  const handleGenerateTopics = (generatedTopics: Topic[]) => {
    setTopics([...topics, ...generatedTopics]);
    setCurrentTab("manual");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectSelection 
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        );
      case 2:
        return (
          <LanguageSelection
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        );
      case 3:
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
                <TopicsList topics={topics} onRemoveTopic={handleRemoveTopic} />
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
                />
              </TabsContent>

              <TabsContent value="upload">
                <UploadCSVTab />
              </TabsContent>
            </Tabs>
          </Card>
        );
      case 4:
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span>/</span>
          <a href="/models" className="hover:text-gray-900">Models</a>
          <span>/</span>
          <span className="text-gray-900">Copy-mate-003</span>
        </nav>

        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2">
            {renderStepContent()}
          </div>

          {/* Summary Sidebar */}
          <div className="col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Project:</span>
                  <span className="text-gray-900">{selectedProject || "not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Articles to write:</span>
                  <span className="text-gray-900">{topics.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Image cost:</span>
                  <span className="text-gray-900">{topics.filter(t => t.options.generateImage).length} Tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="text-gray-900">{selectedLanguage || "not selected"}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="px-6"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="px-6 bg-purple-600 hover:bg-purple-700"
            disabled={
              (currentStep === 1 && !selectedProject) ||
              (currentStep === 2 && !selectedLanguage)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
