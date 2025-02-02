import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArticleGeneration } from "./use-article-generation";

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

export const useNavigation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentTab, setCurrentTab] = useState("manual");
  
  const { generateArticles } = useArticleGeneration();

  const handleNext = async (topics: Topic[]) => {
    if (currentStep === 4) {
      await generateArticles(topics, selectedProject, selectedLanguage, () => {
        setCurrentStep(5);
      });
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

  return {
    currentStep,
    setCurrentStep,
    selectedProject,
    setSelectedProject,
    selectedLanguage,
    setSelectedLanguage,
    currentTab,
    setCurrentTab,
    handleNext,
    handleBack,
  };
};