
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface Category {
  storeName: string;
  categoryName: string;
  keywords: string;
  keyFeatures: string;
}

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
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  topic: string;
  setTopic: (topic: string) => void;
  options: {
    addH2: boolean;
    faq: boolean;
    tableOfContents: boolean;
    generateImage: boolean;
  };
  setOptions: (options: any) => void;
  h2Headings: string;
  setH2Headings: (headings: string) => void;
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
  keywordInput: string;
  setKeywordInput: (input: string) => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  handleNext: () => void;
  handleBack: () => void;
}

const ContentCreationContext = createContext<ContentCreationContextType | undefined>(undefined);

export function ContentCreationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState({
    addH2: false,
    faq: false,
    tableOfContents: false,
    generateImage: false,
  });
  const [h2Headings, setH2Headings] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("manual");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (currentStep === 1 && !selectedProject) {
      toast({
        title: "Please select a project",
        description: "You need to select a project before proceeding.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep === 2 && !selectedLanguage) {
      toast({
        title: "Please select a language",
        description: "You need to select a language before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const value = {
    currentStep,
    setCurrentStep,
    selectedProject,
    setSelectedProject,
    selectedLanguage,
    setSelectedLanguage,
    categories,
    setCategories,
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
