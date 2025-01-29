import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContentHeader } from "@/components/create-content/ContentHeader";
import { ContentTabs } from "@/components/create-content/ContentTabs";
import { StepIndicator } from "@/components/create-content/StepIndicator";
import { ProjectSelection } from "@/components/create-content/ProjectSelection";
import { LanguageSelection } from "@/components/create-content/LanguageSelection";
import { ReviewSection } from "@/components/create-content/ReviewSection";
import { Summary } from "@/components/create-content/Summary";
import { NavigationButtons } from "@/components/create-content/NavigationButtons";

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

  const handleUpdateTopic = (index: number, updatedTopic: Topic) => {
    const newTopics = [...topics];
    newTopics[index] = updatedTopic;
    setTopics(newTopics);
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
          <ContentTabs
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            topic={topic}
            setTopic={setTopic}
            options={options}
            setOptions={setOptions}
            h2Headings={h2Headings}
            setH2Headings={setH2Headings}
            topics={topics}
            onAddTopic={handleAddTopic}
            onRemoveTopic={handleRemoveTopic}
            onUpdateTopic={handleUpdateTopic}
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
            keywords={keywords}
            onAddKeyword={handleAddKeyword}
            onDeleteKeyword={handleDeleteKeyword}
            onGenerateTopics={handleGenerateTopics}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        );
      case 4:
        return <ReviewSection topics={topics} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentHeader />
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {renderStepContent()}
          </div>

          <div className="col-span-1">
            <Summary
              selectedProject={selectedProject}
              selectedLanguage={selectedLanguage}
              topicsCount={topics.length}
              imageCount={topics.filter(t => t.options.generateImage).length}
            />
          </div>
        </div>

        <NavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          disableNext={
            (currentStep === 1 && !selectedProject) ||
            (currentStep === 2 && !selectedLanguage)
          }
        />
      </div>
    </div>
  );
}