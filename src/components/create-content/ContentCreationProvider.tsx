import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
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

  // Add session check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to generate articles.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };
    checkSession();
  }, [navigate, toast]);

  const handleNext = async () => {
    if (currentStep === 4) {
      try {
        setIsGenerating(true);
        toast({
          title: "Creating content",
          description: "Your content is being generated. Please wait...",
        });

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to generate articles.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        const response = await fetch('/functions/v1/generate-articles', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topics,
            projectId: selectedProject,
            language: selectedLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate articles');
        }

        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }

        setCurrentStep(5);
        toast({
          title: "Success",
          description: "Articles have been generated successfully!",
        });
      } catch (error) {
        console.error('Error generating articles:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to generate articles. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    } else if (currentStep < 5) {
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