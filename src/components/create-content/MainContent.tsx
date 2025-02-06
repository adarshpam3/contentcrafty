import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";
import { useContentCreation } from "./ContentCreationProvider";

export function MainContent() {
  const {
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
  } = useContentCreation();

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
      case 5:
        return <StepFive />;
      default:
        return null;
    }
  };

  return renderStepContent();
}