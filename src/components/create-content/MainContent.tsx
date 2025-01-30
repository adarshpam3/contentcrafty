import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";

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

interface MainContentProps {
  currentStep: number;
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
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  setSelectedLanguage: (value: string) => void;
}

export function MainContent({
  currentStep,
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
  selectedProject,
  setSelectedProject,
  setSelectedLanguage,
}: MainContentProps) {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne 
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        );
      case 2:
        return (
          <StepTwo
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        );
      case 3:
        return (
          <StepThree
            topic={topic}
            setTopic={setTopic}
            options={options}
            setOptions={setOptions}
            h2Headings={h2Headings}
            setH2Headings={setH2Headings}
            handleAddTopic={handleAddTopic}
            topics={topics}
            handleRemoveTopic={handleRemoveTopic}
            handleUpdateTopic={handleUpdateTopic}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
            keywords={keywords}
            handleAddKeyword={handleAddKeyword}
            handleDeleteKeyword={handleDeleteKeyword}
            handleGenerateTopics={handleGenerateTopics}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            selectedLanguage={selectedLanguage}
          />
        );
      case 4:
        return <StepFour topics={topics} />;
      default:
        return null;
    }
  };

  return renderStepContent();
}