
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";
import { useContentCreation } from "./ContentCreationProvider";

export function MainContent() {
  const {
    currentStep,
    selectedProject,
    setSelectedProject,
    selectedLanguage,
    setSelectedLanguage,
    categories,
    topic,
    setTopic,
    options,
    setOptions,
    h2Headings,
    setH2Headings,
    topics,
    setTopics,
    keywordInput,
    setKeywordInput,
    keywords,
    setKeywords,
    currentTab,
    setCurrentTab,
    isGenerating,
    setIsGenerating,
  } = useContentCreation();

  const handleAddTopic = () => {
    const newTopic = {
      title: topic,
      h2Headings: h2Headings.split('\n').filter(h => h.trim() !== ''),
      options: { ...options },
    };
    setTopics([...topics, newTopic]);
    setTopic('');
    setH2Headings('');
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

  const handleUpdateTopic = (index: number, updatedTopic: any) => {
    const newTopics = [...topics];
    newTopics[index] = updatedTopic;
    setTopics(newTopics);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleDeleteKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleGenerateTopics = async (generatedTopics: any[]) => {
    setTopics([...topics, ...generatedTopics]);
  };

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
        return (
          <StepFour 
            categories={categories} 
            selectedLanguage={selectedLanguage}
          />
        );
      case 5:
        return <StepFive />;
      default:
        return null;
    }
  };

  return renderStepContent();
}
