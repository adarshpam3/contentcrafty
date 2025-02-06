
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface Category {
  storeName: string;
  categoryName: string;
  keywords: string;
  keyFeatures: string;
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
