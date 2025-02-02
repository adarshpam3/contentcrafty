import { createContext, useContext } from "react";
import { useAuthCheck } from "@/hooks/use-auth-check";
import { useArticleGeneration } from "@/hooks/use-article-generation";
import { useTopics } from "@/hooks/use-topics";
import { useKeywords } from "@/hooks/use-keywords";
import { useNavigation } from "@/hooks/use-navigation";

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

interface ContentCreationContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  options: Topic["options"];
  setOptions: (options: Topic["options"]) => void;
  h2Headings: string;
  setH2Headings: (headings: string) => void;
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  keywordInput: string;
  setKeywordInput: (input: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  handleAddTopic: () => void;
  handleRemoveTopic: (index: number) => void;
  handleAddKeyword: () => void;
  handleDeleteKeyword: (keyword: string) => void;
  handleGenerateTopics: (topics: Topic[]) => void;
  handleUpdateTopic: (index: number, topic: Topic) => void;
  handleNext: () => void;
  handleBack: () => void;
}

const ContentCreationContext = createContext<ContentCreationContextType | undefined>(undefined);

export function ContentCreationProvider({ children }: { children: React.ReactNode }) {
  // Use our hooks
  useAuthCheck();
  const { isGenerating, setIsGenerating } = useArticleGeneration();
  const {
    topic,
    setTopic,
    h2Headings,
    setH2Headings,
    topics,
    setTopics,
    options,
    setOptions,
    handleAddTopic,
    handleRemoveTopic,
    handleUpdateTopic,
  } = useTopics();

  const {
    keywords,
    setKeywords,
    keywordInput,
    setKeywordInput,
    handleAddKeyword,
    handleDeleteKeyword,
  } = useKeywords();

  const {
    currentStep,
    setCurrentStep,
    selectedProject,
    setSelectedProject,
    selectedLanguage,
    setSelectedLanguage,
    currentTab,
    setCurrentTab,
    handleNext: baseHandleNext,
    handleBack,
  } = useNavigation();

  const handleGenerateTopics = (generatedTopics: Topic[]) => {
    setTopics([...topics, ...generatedTopics]);
    setCurrentTab("manual");
  };

  const handleNext = () => {
    baseHandleNext(topics);
  };

  const value = {
    currentStep,
    setCurrentStep,
    selectedProject,
    setSelectedProject,
    selectedLanguage,
    setSelectedLanguage,
    topic,
    setTopic,
    options,
    setOptions,
    h2Headings,
    setH2Headings,
    topics,
    setTopics,
    currentTab,
    setCurrentTab,
    keywords,
    setKeywords,
    keywordInput,
    setKeywordInput,
    isGenerating,
    setIsGenerating,
    handleAddTopic,
    handleRemoveTopic,
    handleAddKeyword,
    handleDeleteKeyword,
    handleGenerateTopics,
    handleUpdateTopic,
    handleNext,
    handleBack,
  };

  return (
    <ContentCreationContext.Provider value={value}>
      {children}
    </ContentCreationContext.Provider>
  );
}

export const useContentCreation = () => {
  const context = useContext(ContentCreationContext);
  if (context === undefined) {
    throw new Error("useContentCreation must be used within a ContentCreationProvider");
  }
  return context;
};